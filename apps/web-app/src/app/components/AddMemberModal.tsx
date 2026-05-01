import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "react-hot-toast";
import {
  createFirstTimer,
  createSalvationRecord,
  createPrayerRequest,
  createFollowUp,
} from "@/api/church";
import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// ── Schemas ────────────────────────────────────────────────────────────────

// Accepts E.164 format (+<country code><number>, 8–16 digits total) or
// common local formats with optional spaces/dashes (min 7 digits stripped).
const phoneRegex = /^\+?[1-9]\d{6,14}$/;
const phoneValidation = z
  .string()
  .min(1, "Phone number is required")
  .refine(
    (val) => phoneRegex.test(val.replace(/[\s\-().]/g, "")),
    "Enter a valid phone number (e.g. +2348012345678)",
  );

const firstTimerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phoneNumber: phoneValidation,
  visitType: z.enum(["first_time", "second_time"]),
  prayerRequest: z.string().optional(),
  serviceDate: z.string().min(1, "Service date is required"),
  firstTimerId: z.string().optional(),
});

const salvationSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phoneNumber: phoneValidation,
  dateOfDecision: z.string().min(1, "Date of decision is required"),
  notes: z.string().optional(),
});

const prayerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phoneNumber: phoneValidation,
  request: z.string().min(5, "Prayer request must be more detailed"),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
});

const followUpSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phoneNumber: phoneValidation,
  description: z.string().min(5, "Description is required"),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  dueDate: z.string().min(1, "Due date is required"),
});

// ── Types ───────────────────────────────────────────────────────────────────

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  type:
    | "first-timers"
    | "second-timers"
    | "salvation-records"
    | "prayer-requests"
    | "follow-ups";
  onSuccess: () => void;
}

// ── Shared field styles ─────────────────────────────────────────────────────

const labelCls =
  "text-xs uppercase tracking-widest text-muted-foreground font-bold";
const inputCls = "rounded-xl border-border bg-muted/20 h-12";
const selectCls = "rounded-xl border-border bg-muted/20 h-12";

// ── Component ───────────────────────────────────────────────────────────────

export function AddMemberModal({
  isOpen,
  onClose,
  type,
  onSuccess,
}: AddMemberModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const organizationId = user?.organizationId || user?.id || "";
  const queryClient = useQueryClient();

  const getSchema = () => {
    switch (type) {
      case "first-timers":
      case "second-timers":
        return firstTimerSchema;
      case "salvation-records":
        return salvationSchema;
      case "prayer-requests":
        return prayerSchema;
      case "follow-ups":
        return followUpSchema;
      default:
        return firstTimerSchema;
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const form = useForm<any>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      visitType: type === "second-timers" ? "second_time" : "first_time",
      prayerRequest: "",
      serviceDate: today,
      firstTimerId: "",
      dateOfDecision: today,
      notes: "",
      request: "",
      priority: "MEDIUM",
      description: "",
      dueDate: tomorrow,
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      let res;

      switch (type) {
        case "first-timers":
        case "second-timers": {
          const payload = {
            organizationId,
            name: data.name,
            phoneNumber: data.phoneNumber,
            email: data.email || undefined,
            prayerRequest: data.prayerRequest || undefined,
            visitType: data.visitType,
            serviceDate: data.serviceDate,
            firstTimerId: data.firstTimerId || undefined,
          };
          res = await createFirstTimer(payload);

          // If a prayer request was entered, also create it on the Prayer Requests page
          if (res?.success && data.prayerRequest?.trim()) {
            const prRes = await createPrayerRequest(organizationId, {
              name: data.name,
              phoneNumber: data.phoneNumber,
              email: data.email || undefined,
              request: data.prayerRequest.trim(),
              priority: "MEDIUM",
            });
            if (prRes?.success) {
              // Invalidate so the Prayer Requests page refetches immediately
              queryClient.invalidateQueries({ queryKey: ["prayer-requests"] });
            }
          }
          break;
        }
        case "salvation-records":
          res = await createSalvationRecord(organizationId, {
            name: data.name,
            phoneNumber: data.phoneNumber,
            email: data.email || undefined,
            dateOfDecision: data.dateOfDecision,
            notes: data.notes || undefined,
          });
          break;
        case "prayer-requests":
          res = await createPrayerRequest(organizationId, {
            name: data.name,
            phoneNumber: data.phoneNumber,
            email: data.email || undefined,
            request: data.request,
            priority: data.priority,
          });
          break;
        case "follow-ups":
          res = await createFollowUp(organizationId, {
            newMemberId: "manual-" + Date.now(),
            name: data.name,
            tags: ["manual"],
            priority: data.priority,
            description: data.description,
            dueDate: data.dueDate,
          });
          break;
      }

      if (res?.success) {
        toast.success("Record added successfully");
        onSuccess();
        onClose();
        form.reset();
      } else {
        toast.error((res as any)?.error || "Failed to add record");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const title = type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const isFirstOrSecond = type === "first-timers" || type === "second-timers";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Add New {title.slice(0, -1)}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter the details manually to update the church records.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {/* ── Name ── */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Amara Nwosu"
                      className={inputCls}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Email + Phone ── */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="amara@example.com"
                        className={inputCls}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+2349087654321"
                        className={inputCls}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ── First / Second Timer fields ── */}
            {isFirstOrSecond && (
              <>
                {/* Visit Type — read-only, locked to the form type */}
                <FormField
                  control={form.control}
                  name="visitType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelCls}>Visit Type</FormLabel>
                      {/* Hidden input keeps the value registered in the form */}
                      <input type="hidden" {...field} />
                      <FormControl>
                        <div className={`${inputCls} flex items-center px-4 text-foreground/80 bg-muted/30 cursor-not-allowed select-none`}>
                          {type === "second-timers" ? "Second Time" : "First Time"}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Service Date */}
                <FormField
                  control={form.control}
                  name="serviceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelCls}>Service Date</FormLabel>
                      <FormControl>
                        <Input type="date" className={inputCls} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Prayer Request */}
                <FormField
                  control={form.control}
                  name="prayerRequest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelCls}>
                        Prayer Request{" "}
                        <span className="normal-case text-muted-foreground/60">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Trusting God for a new job opportunity."
                          className="rounded-xl border-border bg-muted/20 min-h-[90px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* First Timer ID (optional, hidden unless populated) */}
                <FormField
                  control={form.control}
                  name="firstTimerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelCls}>
                        First Timer ID{" "}
                        <span className="normal-case text-muted-foreground/60">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Leave blank to auto-assign"
                          className={inputCls}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* ── Salvation Record fields ── */}
            {type === "salvation-records" && (
              <>
                <FormField
                  control={form.control}
                  name="dateOfDecision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelCls}>
                        Date of Decision
                      </FormLabel>
                      <FormControl>
                        <Input type="date" className={inputCls} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelCls}>Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Made decision during altar call..."
                          className="rounded-xl border-border bg-muted/20 min-h-[90px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* ── Prayer Request fields ── */}
            {type === "prayer-requests" && (
              <>
                <FormField
                  control={form.control}
                  name="request"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelCls}>Prayer Request</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Details of the request..."
                          className="rounded-xl border-border bg-muted/20 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelCls}>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={selectCls}>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-border">
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* ── Follow-up fields ── */}
            {type === "follow-ups" && (
              <>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelCls}>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Follow up details..."
                          className="rounded-xl border-border bg-muted/20 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelCls}>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" className={inputCls} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelCls}>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={selectCls}>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-border">
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="rounded-xl h-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl h-12 px-8 bg-primary text-primary-foreground"
              >
                {isLoading && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Add Entry
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

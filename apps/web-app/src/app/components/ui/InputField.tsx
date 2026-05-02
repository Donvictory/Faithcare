import * as React from "react";
import { Control, ControllerRenderProps, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Checkbox } from "./checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "./input-otp";
import SearchableSelect, { SearchableSelectProps } from "./SearchableSelect";
import { MultiSelect } from "./MultiSelect";
import { CardMultiSelect } from "./CardMultiSelect";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "./utils";
import { Button } from "@/components/ui/button";

export type InputFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "searchable-select"
  | "select"
  | "file"
  | "checkbox"
  | "otp"
  | "radio-group"
  | "multi-select"
  | "card-multi-select"
  | "custom";

export interface InputFieldProps {
  control: Control<any>;
  name: string;
  label?: React.ReactNode;
  placeholder?: string;
  type?: InputFieldType;
  icon?: any; // Accepting the icon component
  iconPosition?: "left" | "right";
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;

  // Select / Radio Group Props
  options?: { label: string; value: string }[];

  // Searchable Select Props
  searchableOptions?: any[];
  getDisplayValue?: (item: any) => React.ReactNode;
  getStringValue?: (item: any) => string;
  onSearch?: (searchTerm: string) => void;

  // OTP Props
  otpLength?: number;

  // Custom Props
  children?: React.ReactNode | ((field: ControllerRenderProps<FieldValues, string>) => React.ReactNode);
}

export function InputField({
  control,
  name,
  label,
  placeholder,
  type = "text",
  icon,
  iconPosition = "left",
  description,
  disabled,
  className,
  inputClassName,
  labelClassName,
  options = [],
  searchableOptions = [],
  getDisplayValue,
  getStringValue,
  onSearch,
  otpLength = 6,
  children,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const renderField = (field: ControllerRenderProps<FieldValues, string>) => {
    switch (type) {
      case "text":
      case "email":
      case "number":
      case "password":
        const isPassword = type === "password";
        return (
          <div className="relative group">
            {icon && (
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors flex items-center justify-center z-10",
                iconPosition === "left" ? "left-4.5" : "right-4.5"
              )}>
                {React.isValidElement(icon) ? icon : React.createElement(icon, { className: "w-4 h-4", strokeWidth: 1.5 })}
              </div>
            )}
            <FormControl>
              <Input
                type={isPassword ? (showPassword ? "text" : "password") : type}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "w-full h-[52px] bg-secondary/30 border border-neutral-200 rounded-lg focus-visible:ring-4 focus-visible:ring-accent/5 focus-visible:border-accent transition-all text-foreground font-medium tracking-tight text-lg",
                  icon && iconPosition === "left" ? "pl-12" : "pl-6",
                  (isPassword || (icon && iconPosition === "right")) ? "pr-12" : "pr-6",
                  inputClassName
                )}
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value;
                  field.onChange(val);
                }}
              />
            </FormControl>
            {isPassword && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none h-8 w-8"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            )}
          </div>
        );

      case "textarea":
        return (
          <FormControl>
            <Textarea
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "w-full bg-secondary/30 border border-neutral-200 rounded-lg focus-visible:ring-4 focus-visible:ring-accent/5 focus-visible:border-accent transition-all text-foreground font-medium tracking-tight text-lg min-h-[100px]",
                inputClassName
              )}
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className={inputClassName}
              />
            </FormControl>
            {label && (
              <FormLabel className="text-sm font-medium cursor-pointer m-0 leading-none">
                {label}
              </FormLabel>
            )}
          </div>
        );

      case "otp":
        return (
          <InputOTP
            maxLength={otpLength}
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
            className={inputClassName}
          >
            <InputOTPGroup>
              {Array.from({ length: otpLength }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-[52px] text-xl rounded-lg border-border bg-secondary/30"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        );

      case "select":
        return (
          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
            <FormControl>
              <SelectTrigger className={cn("h-[52px] bg-secondary/30 rounded-lg border-neutral-200 font-medium", inputClassName)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "searchable-select":
        return (
          <SearchableSelect
            placeholder={placeholder}
            options={searchableOptions}
            onSelect={field.onChange}
            selectedItem={field.value}
            getDisplayValue={getDisplayValue!}
            getStringValue={getStringValue}
            onSearch={onSearch}
            inputClassName={cn("h-[52px] bg-secondary/30 rounded-lg border-neutral-200", inputClassName)}
          />
        );

      case "radio-group":
        return (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className={cn("flex flex-col space-y-1", inputClassName)}
            disabled={disabled}
          >
            {options.map((option) => (
              <FormItem className="flex items-center space-x-3 space-y-0" key={option.value}>
                <FormControl>
                  <RadioGroupItem value={option.value} />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  {option.label}
                </FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        );
      
      case "multi-select":
        return (
          <MultiSelect
            options={options}
            selected={field.value || []}
            onChange={field.onChange}
            placeholder={placeholder}
            className={inputClassName}
          />
        );

      case "card-multi-select":
        return (
          <CardMultiSelect
            options={options}
            value={field.value || []}
            onChange={field.onChange}
            disabled={disabled}
            className={inputClassName}
          />
        );
      
      case "file":
        return (
          <FormControl>
            <Input
              type="file"
              disabled={disabled}
              className={cn("file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/90 py-3 h-auto cursor-pointer", inputClassName)}
              onChange={(e) => field.onChange(e.target.files)}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </FormControl>
        );

      case "custom":
        if (typeof children === "function") {
          return children(field);
        }
        return <FormControl>{children}</FormControl>;

      default:
        return null;
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full gap-2", className)}>
          {type !== "checkbox" && label && (
            <FormLabel className={cn(
              "text-sm font-medium text-muted-foreground ml-1",
              labelClassName
            )}>
              {label}
            </FormLabel>
          )}

          {renderField(field)}

          {description && (
            <FormDescription className="text-sm font-medium text-muted-foreground/50 italic ml-1">
              {description}
            </FormDescription>
          )}
          <FormMessage className="ml-1" />
        </FormItem>
      )}
    />
  );
}

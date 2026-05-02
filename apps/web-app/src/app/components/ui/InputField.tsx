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
import { Label } from "./label";

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
  control?: Control<any>;
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

  // Standard React / Non-hook-form props
  value?: any;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
  error?: string;

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
  value,
  onChange,
  onBlur,
  error,
  options = [],
  searchableOptions = [],
  getDisplayValue,
  getStringValue,
  onSearch,
  otpLength = 6,
  children,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const renderFieldContent = (field: any) => {
    const useForm = !!control;
    const ControlWrapper = useForm ? FormControl : React.Fragment;

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
            <ControlWrapper>
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
            </ControlWrapper>
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
          <ControlWrapper>
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
          </ControlWrapper>
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2">
            <ControlWrapper>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className={inputClassName}
              />
            </ControlWrapper>
            {label && (
              useForm ? (
                <FormLabel className="text-sm font-medium cursor-pointer m-0 leading-none">
                  {label}
                </FormLabel>
              ) : (
                <Label className="text-sm font-medium cursor-pointer m-0 leading-none" htmlFor={name}>
                  {label}
                </Label>
              )
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
            <ControlWrapper>
              <SelectTrigger className={cn("h-[52px] bg-secondary/30 rounded-lg border-neutral-200 font-medium", inputClassName)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </ControlWrapper>
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
              <div className="flex items-center space-x-3 space-y-0" key={option.value}>
                <ControlWrapper>
                  <RadioGroupItem value={option.value} />
                </ControlWrapper>
                {useForm ? (
                  <FormLabel className="font-normal cursor-pointer">
                    {option.label}
                  </FormLabel>
                ) : (
                  <Label className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                )}
              </div>
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
          <ControlWrapper>
            <Input
              type="file"
              disabled={disabled}
              className={cn("file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/90 py-3 h-auto cursor-pointer", inputClassName)}
              onChange={(e) => field.onChange(e.target.files)}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          </ControlWrapper>
        );

      case "custom":
        if (typeof children === "function") {
          return children(field);
        }
        return <ControlWrapper>{children}</ControlWrapper>;

      default:
        return null;
    }
  };

  if (control) {
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

            {renderFieldContent(field)}

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

  // Standalone version
  const standaloneField = {
    name,
    value,
    onChange: (val: any) => {
      if (onChange) {
        // If it looks like an event, pass it through, otherwise mock it
        if (val && typeof val === "object" && "target" in val) {
          onChange(val);
        } else {
          onChange({ target: { name, value: val } } as any);
        }
      }
    },
    onBlur: (e: any) => onBlur?.(e),
    ref: () => {},
  };

  return (
    <div className={cn("w-full grid gap-2", className)}>
      {type !== "checkbox" && label && (
        <Label className={cn(
          "text-sm font-medium text-muted-foreground ml-1",
          labelClassName
        )} htmlFor={name}>
          {label}
        </Label>
      )}

      {renderFieldContent(standaloneField)}

      {description && (
        <p className="text-sm font-medium text-muted-foreground/50 italic ml-1">
          {description}
        </p>
      )}
      {error && <p className="text-destructive text-sm ml-1">{error}</p>}
    </div>
  );
}

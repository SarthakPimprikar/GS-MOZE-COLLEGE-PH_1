import React from "react";
import { Controller } from "react-hook-form";

const FormField = ({
    control,
    name,
    label,
    type = "text",
    placeholder = "",
    options = [],
    icon = null,
    error = null,
    required = false,
    pattern = null,
    minLength,
    maxLength,
    min = null,
    max = null,
    validate = null,
    alphaOnly = false,
    numericOnly = false,
    maxDate = null,
    ...props
}) => {
    const handleTextInput = (e) => {
        // Only allow alphabets and spaces for text fields
        if (type === "text" && alphaOnly) {
            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
        }
        // Only allow numbers for numeric fields
        if (type === "number" || (type === "tel" && numericOnly)) {
            e.target.value = e.target.value.replace(/\D/g, "");
        }
    };

    // Filter out custom props that shouldn't be passed to DOM elements
    const inputProps = {
        ...props,
        ...(type === "date" && maxDate ? { max: maxDate } : {}),
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <Controller
                name={name}
                control={control}
                rules={{
                    required: required ? `${label} is required` : false,
                    pattern,
                    minLength,
                    maxLength,
                    min,
                    max,
                    validate,
                }}
                render={({ field }) => {
                    if (type === "select") {
                        return (
                            <select
                                {...field}
                                className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"
                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                {...inputProps}
                            >
                                {options.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        );
                    }

                    if (type === "date") {
                        return (
                            <div className="relative">
                                <input
                                    {...field}
                                    type="date"
                                    value={field.value || ""}
                                    className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    placeholder={placeholder}
                                    max={props.maxDate || undefined}
                                    {...inputProps}
                                />
                                {icon && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        {icon}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <div className="relative">
                            <input
                                {...field}
                                type={type}
                                value={field.value || ""}
                                minLength={minLength}
                                maxLength={maxLength}
                                onChange={(e) => {
                                    handleTextInput(e);
                                    field.onChange(e);
                                }}
                                className={`w-full px-3 py-2 border ${error ? "border-red-500" : "border-gray-300"
                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder={placeholder}
                                pattern={pattern?.value instanceof RegExp ? pattern.value.source : pattern?.value || pattern}
                                {...inputProps}
                            />
                            {icon && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    {icon}
                                </div>
                            )}
                        </div>
                    );
                }}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
        </div>
    );
};

export default FormField;

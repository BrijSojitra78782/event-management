import { useState } from "react";




/**
 * A React hook that manages form state and validation.
 * 
 * @param initialValues - The initial values of the form fields.
 * @param validate - A function that takes a field name and value and returns an error message if the field is invalid.
 * @author Dev Muliya 
 * 
 * @returns An object with the following properties:
 *  - values: The current values of the form fields.
 *  - errors: An object with the field names as keys and the error messages as values.
 *  - handleChange: A function that takes a field name and value and updates the state with the new value and validates the field using the validate function if provided.
 *  - handleBlur: A function that takes a field name and validates the field using the validate function if provided and updates the state with the error message.
 *  - handleSubmit: A function that takes a form submission event and a callback function to be called if the form is valid.
 * 
 * The validate function should return null or undefined if the field is valid, or a string with the error message if the field is invalid.
 * The validate function can be omitted if no validation is needed.
 * The validate function is called with the field name and the value of the field as arguments.
 */
const useForm = (initialValues: any, validate?: (feildName: string, value: any) => any) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<any>({});
    const [isSubmitted, setSubmit] = useState<boolean>(false);
    /**
     * Handles the change event of a form field. Updates the state with the new value and validates the field using the validate function if provided.
     * 
     * @param feildName - The name of the form field.
     * @param value - The new value of the form field.
     */
    const handleChange = (feildName: string, value: any) => {
        setValues({
            ...values,
            [feildName]: value
        });
        setErrors({
            ...errors,
            [feildName]: ""
        });
    }

    /**
     * Handles the blur event of a form field. Validates the field using the validate function if provided and updates the state with the error message.
     * 
     * @param feildName - The name of the form field.
     */
    const handleBlur = (feildName: string) => {
        if (validate) {
            const error = validate(feildName, values[feildName]);
            setErrors({
                ...errors,
                [feildName]: error
            });
        }
    }



    /**
     * Handles the submit event for the form. Prevents the default form submission, validates the form,
     * and calls the provided onSubmit function if there are no validation errors.
     * 
     * @param event - The form submission event.
     * @param onSubmit - A callback function to be called if the form is valid.
     */
    const handleSubmit = (event: any, onSubmit: () => any) => {
        setSubmit( true);
        event.preventDefault();
        const error = validateForm();
        if (Object.keys(error).length === 0) {
            onSubmit();
        };

    }

    /**
     * Validates the entire form, calling the validate function for each field,
     * and sets the errors state with the result.
     * 
     * @returns An object with the field names as keys and the error messages as values
     */
    const validateForm = () => {
        const validationErrors: any = {};
        Object.keys(values).forEach((feildName) => {
            const error = validate ? validate(feildName, values[feildName]) : null;
            if (error) {
                validationErrors[feildName] = error;
            }
        });
        setErrors(validationErrors);
        return validationErrors;
    }


    return {
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit
    }

}

export default useForm;
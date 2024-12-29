import { Controller, Control, FieldValues } from 'react-hook-form';
import React from 'react';
import { HelperText, TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface CustomInputProps {
  control: Control<FieldValues, any>;
  name: string;
  validationRules?: object;
  placeholder?: string;
  label?: string;
  errors?: any;
  multiline?: boolean;
  keyboardType?: any;
  readonly?: boolean;
  inputTextIcon?: React.ReactNode;
  children?: any;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  control,
  name,
  validationRules = {},
  placeholder = '',
  errors = {},
  multiline = false,
  keyboardType = 'text',
  readonly = false,
  // inputTextIcon,
}) => {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={validationRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            style={styles.input}
            multiline={multiline}
            keyboardType={keyboardType}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            editable={!readonly}
            error={!!errors[name]}
            theme={{
              colors: {
                text: '#213190', // Text color
                placeholder: 'gray', // Placeholder color
                primary: '#213190', // Outline color when focused
                error: 'red', // Error outline color
              },
            }}
          />
        )}
      />
      {errors[name] && (
        <HelperText
          type="error"
          visible={!!errors[name]}
          style={styles.helperText}
        >
          {errors[name]?.message}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16, // Adds spacing between input fields
  },
  input: {
    backgroundColor: 'transparent', // Transparent background
  },
  helperText: {
    fontSize: 12, // Smaller font size for error messages
    marginTop: 4, // Adds spacing after the input
  },
});

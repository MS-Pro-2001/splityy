import { Controller, Control, FieldValues } from 'react-hook-form';
import React from 'react';
import { HelperText, TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

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
  //   inputTextIcon,
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={validationRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
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
              error={!!errors[name] && Object.keys(errors[name])?.length !== 0}
              theme={{
                colors: {
                  text: '#213190', // Text color
                  placeholder: 'gray', // Placeholder color
                  //   primary: '#213190', // Outline color when focused
                },
              }}
            />
          </>
        )}
      />
      {errors[name] && (
        <HelperText style={{ marginTop: -50, color: 'red' }} visible={true}>
          {errors[name].message}
        </HelperText>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent', // Removes background color to keep it flat
    paddingHorizontal: 0,
    // color: 'black',
  },
});

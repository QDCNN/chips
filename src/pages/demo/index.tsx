import { ArrayItems } from '@/components';
import { createSchemaField, FormProvider } from '@formily/react';
import { Input, View } from '@tarojs/components';
import { LinkCell } from '@/formily-components';
import React from 'react';
import { createForm } from '@formily/core';
import '@/weui/style/weui.less';

const SchemaField = createSchemaField({
  components: {
    // BaseView,
    // DatePicker,
    // Editable,
    // Space,
    // Input,
    // Select,
    LinkCell,
    ArrayItems,
    BaseView: View,
  },
})

const form = createForm()

const DemoPage = () => {
  return (
    <View>
      <Input type="digit" />

      <FormProvider form={form}>
        <SchemaField>
          <SchemaField.Array
            name="string_array"
            title="字符串数组"
            x-decorator="BaseView"
            x-component="ArrayItems"
          >
            <SchemaField.Void x-component="BaseView">
              <SchemaField.Void
                x-decorator="FormItem"
                x-component="ArrayItems.SortHandle"
              />
              <SchemaField.String
                x-decorator="BaseView"
                required
                name="input"
                x-component="LinkCell"
                title="测试"
                x-component-props={{
                  isLink: true,
                  required: true,
                }}
              />
              <SchemaField.String
                x-decorator="BaseView"
                required
                name="input"
                x-component="LinkCell"
                title="测试"
                x-component-props={{
                  isLink: true,
                  required: true,
                }}
              />
              <SchemaField.Void
                x-decorator="BaseView"
                x-component="ArrayItems.Remove"
              />
              {/* <SchemaField.Void
                x-decorator="BaseView"
                x-component="ArrayItems.Copy"
              /> */}
            </SchemaField.Void>
            <SchemaField.Void
              x-component="ArrayItems.Addition"
              title="添加条目"
            />
          </SchemaField.Array>
        </SchemaField>
        {/* <FormButtonGroup>
          <Submit onSubmit={console.log}>提交</Submit>
        </FormButtonGroup> */}
      </FormProvider>
    </View>
  )
}

export default DemoPage;

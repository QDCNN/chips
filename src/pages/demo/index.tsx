import { ArrayItems } from '@/components';
import { createSchemaField, FormProvider } from '@formily/react';
import { Input, View } from '@tarojs/components';
import { Cell, LinkCell, Picker } from '@/formily-components';
import React from 'react';
import { createForm } from '@formily/core';
import '@/weui/style/weui.less';
import { simpleCompiler } from '@/utils/formily';
import { createContext, runInContext } from '@/compiler';


// "description": "{{$self.value ? numeral($self.value).format('0,0.00') : ''}}"


const context = createContext({
  $self: {
    value: '299922',
    props: {},
  },
  $form: {
    values: {
      hukou_movein: {
        is_public: false,
      },
      settlement_method: '18',
    }
  },
  $dictionary: { basic: { graduate_institutions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } }
});
// console.log('simpleCompiler: ', expression, scope)
const result = runInContext('module.exports = $form.values.hukou_movein.is_public', context)
console.log('context result: ', result);

// const result = simpleCompiler(
//   // `Number($self.value).toFixed(2) + "%"`,
//   `Object.assign($self.props, {content: $form.values.hukou_movein.is_public ? '默认为“实际居住地社区公共户”，用户不可修改；' : '需填写户口迁入地的详细地址，例如：**区**路**弄**号**室'})`,
//   // `$self.value ? numeral($self.value).format('0,0.00') : ''`,
//   // `$self.value ? Number($self.value).toFixed(2) + \"%\" : ''`,
//   {
//     $self: {
//       value: '299922',
//       props: {},
//     },
//     $form: {
//       values: {
//         settlement_method: '18',
//       }
//     },
//     $dictionary: { basic: { graduate_institutions: [1,2,3,4,5,6,7,8,9,10] } }
//   }
// )

console.log('result: ', result);

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
      <Picker mode="multiSelector" range={[[1,2,3], [2,3,2]]}>
        <Cell title="测试">测试</Cell>
      </Picker>
      {/* <Input type="digit" /> */}

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

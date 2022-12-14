import { Radio as RadioComponent } from '@/components'
import { connect, mapProps } from '@formily/react'
import { RadioGroupProps } from '@antmjs/vantui/types/radio'

type ComposedRadio = React.FC<React.PropsWithChildren<any>> & {
  Group?: React.FC<React.PropsWithChildren<RadioGroupProps>>
}

export const Radio: ComposedRadio = connect(
  RadioComponent,
  mapProps(
    { dataSource: 'options' },
  ),
)

Radio.Group = connect(
  RadioComponent.Group,
  mapProps(
    { dataSource: 'options' },
    (props, field) => {
      const onChange = props.onChange;
      return {
        onChange(e) {
          onChange(e.detail);
        }
      }
    }
  ),
)

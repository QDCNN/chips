import { View, Textarea as TaroTextarea, Text } from '@tarojs/components'
import cls from 'classnames'
import React, { useCallback, useState } from 'react'

export const Textarea = (props) => {
  const {
    className,
    showCounter, maxLength, defaultValue,
    ...otherProps
  } = props;
  const [textCounter, setTextCounter] = useState(defaultValue?.length || 0);
  const classNameList = cls({
    'weui-textarea': true,
    [className]: className,
  })

  const handleChange = useCallback((e) => {
    setTextCounter(e.detail.value.length)

    otherProps.onChange && otherProps.onChange(e)
  }, [otherProps.onChange])

  return (
    <View>
      <TaroTextarea
        className={classNameList}
        maxlength={maxLength}
        onInput={handleChange}
        {...otherProps}
      />
      {
        showCounter ?
          <View className="weui-textarea-counter">
            <Text>{textCounter}</Text>{maxLength ? '/' + maxLength : false}
          </View>
          : false
      }
    </View>
  )
}

export default Textarea

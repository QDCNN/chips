import { View, Textarea as TaroTextarea } from '@tarojs/components'
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
          <div className="weui-textarea-counter">
            <span>{textCounter}</span>{maxLength ? '/' + maxLength : false}
          </div>
          : false
      }
    </View>
  )
}

export default Textarea

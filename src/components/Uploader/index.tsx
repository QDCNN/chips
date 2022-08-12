import { Icon, View, Text } from '@tarojs/components';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import Cell from '../Cell';
import styles from './index.module.less';

export const Uploader = (props) => {
  const {
    title = '图片上传',
    description = '描述信息',
    maxCount = 9,
    maxWidth = 500,
    onUpload,
    onPrePathsHandle,
    onChange,
    onError,
    value = [],
    langs = { maxError: maxCount => `最多只能上传${maxCount}张图片` },
    className,
    ...others
  } = props;

  const [showPaths, setShowPaths] = useState<string[]>([]);
  const [tempFiles, setTempFiles] = useState<any[]>([]);

  const cls = classNames({
    // 'weui-cells': true,
    'weui-uploader': true,
    className,
  });

  const handleChooseClick = async () => {
    // console.log('handleChooseClick');
    const chooseImageResult = await Taro.chooseImage({});
    const _files = chooseImageResult.tempFilePaths;
    if (_files.length === 0) return;

    if (_files.length >= props.maxCount) {
      props.onError(langs.maxError(props.maxCount));
      return;
    }

    setTempFiles(chooseImageResult.tempFiles)

    if (onUpload) {
      const uploadResult = await onUpload(chooseImageResult);
      setShowPaths([]);
      onChange && onChange(value.concat(uploadResult));
      await preHandlePaths(uploadResult);
      setTempFiles([]);
    }
  };

  const preHandlePaths = async (paths) => {
    if (!onPrePathsHandle || !paths.length) return paths;
    const nextPaths = await onPrePathsHandle(paths);
    setShowPaths([...showPaths, ...nextPaths]);
  };

  useEffect(() => {
    preHandlePaths(value);
  }, [value])

  // const handleFile = (file, cb) => {
  //   cb(file);
  // }

  const onCloseClick = (index) => {
    const nextValue = [...value];
    nextValue.splice(index, 1);
    setShowPaths([]);
    onChange && onChange([...nextValue]);
  }

  const commonRenderFiles = (pathList, status?) => {
    return pathList.map((path, idx) => {
      // let { path, error, status, onClick } = file;

      let fileStyle = {
        backgroundImage: `url(${path})`
      };
      let cls = classNames({
        'weui-uploader__file': true,
        'weui-uploader__file_status': status == 'uploading'
      });

      // if (onClick) {
      //   deprecationWarning('File onClick', 'Uploader onFileClick');
      // }

      let handleFileClick = e => {
        Taro.previewImage({ urls: pathList, current: path, showmenu: true });
      };

      return (
        <View className={styles.item}>
          {status == 'done' && <Icon className={styles.closeBtn} type="cancel" onClick={() => onCloseClick(idx)} />}
          <View className={cls} key={idx} style={fileStyle} onClick={handleFileClick}>
            <View className="weui-uploader__file-content">
              <Icon type="waiting" />
            </View>
          </View>
        </View>
      );
    });
  }

  const renderTempFiles = useMemo(() => commonRenderFiles(tempFiles.map(item => item.path), 'uploading'), [tempFiles]);

  const renderFiles = useMemo(() => commonRenderFiles(showPaths, 'done'), [showPaths]);

  return (
    <View className="weui-cells">
      <Cell content={(
        <View className={cls} {...others}>
          <View className="weui-uploader__hd">
            <Text className="weui-uploader__title">{title}</Text>
            <View className="weui-uploader__info">{showPaths.length + tempFiles.length}/{maxCount}</View>
          </View>
          <View className="weui-uploader__description">{description}</View>
          <View className="weui-uploader__bd">
            <View className="weui-uploader__files">
              {renderFiles}
              {renderTempFiles}
            </View>
            <View className="weui-uploader__input-box">
              <View
                className="weui-uploader__input"
                onClick={handleChooseClick}
              // accept="image/*"
              // capture="camera"
              // onChange={handleChange}
              // {...inputProps}
              />
            </View>
          </View>
        </View>
      )}>
      </Cell>
    </View>
  )
}

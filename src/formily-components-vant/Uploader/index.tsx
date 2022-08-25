import { CommonApi } from '@/api';
import { wxuuid } from '@/utils/uuid';
import { Uploader as VantUploader} from '@antmjs/vantui'
import { connect, mapProps } from '@formily/react'
import Taro from '@tarojs/taro';
import produce from 'immer';
import { memo, useEffect, useState } from 'react';
import url from 'url';

const singleUpload = async (file, uploadParams) => {
  const uuid = wxuuid();
  const timestamp = +new Date();
  const objectKey = `${timestamp}-${uuid}`
  const targetUrl = `${uploadParams.host}/${objectKey}`;

  await Taro.uploadFile({
    url: uploadParams.host,
    filePath: file.url,
    name: 'file',
    formData: {
      key: objectKey,
      signature: uploadParams.signature,
      policy: uploadParams.policy,
      OSSAccessKeyId: uploadParams.accessKeyId,
      'x-oss-security-token': uploadParams.securityToken
    }
  })
  return targetUrl;
}

const handleAfterRead = async (files) => {
  const aliossResponse = await CommonApi.getAliOSSInfo({});

  return await Promise.all(files.map(file => singleUpload(file, aliossResponse.data)));
}

const handlePreShowFileList = async (paths = [] as any[]) => {
  // if (!paths.length) return paths;
  const objectKeyList = paths.map(item => url.parse(item)?.pathname?.slice(1));
  if (!objectKeyList.filter(item => item).length) return paths;
  const response = await CommonApi.获取阿里云图片链接({ object: objectKeyList.join(',') });
  const result = objectKeyList.map(item => response.data[item]).filter(item => item);
  return result;
};

const transformToUploaderFileList = (fileList = [] as string[]) => {
  return fileList.map(item => ({
    url: item,
    status: 'done',
    message: '上传成功',
    isImage: true
  }));
}

const CustomVantUploader = memo((props) => {
  const [showFileList, setShowFileList] = useState<any[]>([]);
  const { fileList, onPreShowFileList, ...other } = props;

  const handleFileListShow = async () => {
    let nextFileList = fileList;
    if (onPreShowFileList) nextFileList = await onPreShowFileList(fileList)
    setShowFileList(transformToUploaderFileList(nextFileList));
  }

  useEffect(() => {
    handleFileListShow();
  }, [fileList]);

  return (
    <VantUploader fileList={showFileList} {...other} />
  )
})

export const Uploader = connect(
  CustomVantUploader,
  mapProps(
    (props, field: any) => {
      const { onChange } = props;
      const { value = [] } = field;

      return {
        fileList: value,
        onAfterRead: async (e) => {
          const uploadImageList = await handleAfterRead(Array.isArray(e.detail.file) ? e.detail.file : [e.detail.file]);
          onChange([...value, ...uploadImageList]);
        },
        onDelete: (e) => {
          const { fileList, index } = e.detail;
          const nextValue = produce(fileList, draft => {
            draft.splice(index, 1);
          });
          onChange(nextValue);
        },
        onPreShowFileList: handlePreShowFileList,
      }
    }
  )
)

export default Uploader

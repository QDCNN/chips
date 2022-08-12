import { Uploader as OriginUploader } from '@/components'
import { connect, mapProps } from '@formily/react'
import * as api from '@/api';
import Taro from '@tarojs/taro';
import { wxuuid } from '@/utils/uuid';
// import short from 'short-uuid';

const singleUpload = async (file, uploadParams) => {
  const uuid = wxuuid();
  const targetUrl = uploadParams.host + '/' + uuid;

  await Taro.uploadFile({
    url: uploadParams.host,
    filePath: file.path,
    name: 'file',
    formData: {
      key: uuid,
      signature: uploadParams.signature,
      policy: uploadParams.policy,
      OSSAccessKeyId: uploadParams.accessKeyId,
      'x-oss-security-token': uploadParams.securityToken
    }
  })
  return targetUrl;
}

const onUpload = async (chooseResult) => {
  const aliossResponse = await api.getAliOSSInfo({});

  return await Promise.all(chooseResult.tempFiles.map(file => singleUpload(file, aliossResponse.data)));
}

const onPrePathsHandle = async (paths = []) => {
  const uuidList = paths.map(item => item.split('/').pop());
  const response = await api.获取阿里云图片链接({ object: uuidList.join(',') });
  const result = uuidList.map(item => response.data[item]).filter(item => item);
  return result;
};

export const Uploader = connect(
  OriginUploader,
  mapProps(
    (props, field) => {
      return {
        ...props,
        value: props.value,
        onUpload,
        onPrePathsHandle,
        // paths: props.value,
        title: field?.title,
        description: field?.description,
      }
    }
  )
)

export default Uploader

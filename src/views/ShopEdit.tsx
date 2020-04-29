import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Wrapper} from './Shop.Wrapper';
import {F} from '../components/Form';
import {Space} from '../components/Space';
import {MainButton} from '../components/button/MainButton';
import {Stretch} from '../components/Stretch';
import {defaultHttpClient} from '../lib/HttpClient';
import useSWR from 'swr';
import {Loading} from '../components/Loading';
import {showAlert} from '../components/Dialog';
import styled from 'styled-components';
import {DangerButton} from '../components/button/DangerButton';
import {history} from '../lib/history';

const Panel = styled.div`
  padding: 16px;
  margin: 16px 0;
  background: white;
  > h1 {
    font-size: 18px;
    margin-bottom: 8px;
  }
`;
const _ShopEdit: React.FC<RouteComponentProps<{ id: string }>> = (props) => {
  const {data: shop, mutate} = useSWR(`/shop/${props.match.params.id}`, async (key) => {
    const response = await defaultHttpClient.get<Resource<Shop>>(key, {autoHandlerError: true});
    return response.data.data;
  });
  if (!shop) {return <Loading/>;}

  const updateShop = async (data: typeof shop) => {
    await defaultHttpClient.patch(`/shop/${props.match.params.id}`, data, {autoHandlerError: true});
    showAlert('更新成功');
    mutate(data);
  };
  const deleteShop = async (id: number) => {
    await defaultHttpClient.delete(`/shop/${id}`);
    showAlert('删除成功', () => {
      history.push('/shops');
    });
  };
  return (
    <Wrapper shop={shop}>
      <Space/>
      <F title="店铺信息"
        defaultData={shop} fields={[
        {key: 'name', input: {placeholder: '* 店铺名称'}, rules: [{required: true}]},
        {key: 'description', input: {placeholder: '* 店铺描述'}, rules: [{required: true}]},
        {key: 'imgUrl', input: {placeholder: '店铺Logo'}, rules: [{required: true}]},
      ]} onSubmit={updateShop}>
        <Stretch>
          <MainButton type="submit">保存</MainButton>
        </Stretch>
      </F>

      <Panel>
        <h1>其他设置</h1>
        <Stretch>
          <DangerButton onClick={() => deleteShop(shop.id)}>删除店铺</DangerButton>
        </Stretch>
      </Panel>
    </Wrapper>
  );
};

export const ShopEdit = withRouter(_ShopEdit);
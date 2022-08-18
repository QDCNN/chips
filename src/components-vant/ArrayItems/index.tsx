import React, { Fragment } from 'react'
import { CardProps } from 'antd'
import { TreeNode } from '@designable/core'
import {
  useTreeNode,
  TreeNodeWidget,
  DroppableWidget,
  useNodeIdProps,
  DnFC,
} from '@designable/react'
import { ArrayBase } from '../ArrayBase'
import { observer } from '@formily/react'
import { LoadTemplate } from '@/common/LoadTemplate'
import { useDropTemplate } from '@/hooks'
import {
  hasNodeByComponentPath,
  queryNodesByComponentPath,
  createEnsureTypeItemsNode,
  findNodeByComponentPath,
  createNodeId,
} from '@/shared'
import cls from 'classnames'
import { View } from '@tarojs/components'
import './styles.less'

const ensureObjectItemsNode = createEnsureTypeItemsNode('object')

const isArrayItemsOperation = (name: string) =>
  name === 'ArrayItems.Remove' ||
  name === 'ArrayItems.MoveDown' ||
  name === 'ArrayItems.MoveUp'

export const ArrayItems: DnFC<CardProps> = observer((props) => {
  const node = useTreeNode()
  const nodeId = useNodeIdProps()
  const designer = useDropTemplate('ArrayItems', (source) => {
    const indexNode = new TreeNode({
      componentName: node.componentName,
      props: {
        type: 'void',
        'x-component': 'ArrayItems.Index',
      },
    })
    const additionNode = new TreeNode({
      componentName: node.componentName,
      props: {
        type: 'void',
        title: 'Addition',
        'x-component': 'ArrayItems.Addition',
      },
    })
    const removeNode = new TreeNode({
      componentName: node.componentName,
      props: {
        type: 'void',
        title: 'Addition',
        'x-component': 'ArrayItems.Remove',
      },
    })
    const moveDownNode = new TreeNode({
      componentName: node.componentName,
      props: {
        type: 'void',
        title: 'Addition',
        'x-component': 'ArrayItems.MoveDown',
      },
    })
    const moveUpNode = new TreeNode({
      componentName: node.componentName,
      props: {
        type: 'void',
        title: 'Addition',
        'x-component': 'ArrayItems.MoveUp',
      },
    })

    const objectNode = new TreeNode({
      componentName: node.componentName,
      props: {
        type: 'object',
      },
      children: [indexNode, ...source, removeNode, moveDownNode, moveUpNode],
    })
    return [objectNode, additionNode]
  })
  const renderCard = () => {
    if (node.children.length === 0) return <DroppableWidget />
    const additions = queryNodesByComponentPath(node, [
      'ArrayItems',
      'ArrayItems.Addition',
    ])
    const indexes = queryNodesByComponentPath(node, [
      'ArrayItems',
      '*',
      'ArrayItems.Index',
    ])
    const operations = queryNodesByComponentPath(node, [
      'ArrayItems',
      '*',
      isArrayItemsOperation,
    ])
    const children = queryNodesByComponentPath(node, [
      'ArrayItems',
      '*',
      (name) => name.indexOf('ArrayItems.') === -1,
    ])
    return (
      <ArrayBase disabled>
        <ArrayBase.Item index={0} record={null}>
          <View
            {...props}
            className={cls('ant-formily-array-cards-item', props.className)}
          >
            <View>
              <Fragment>
                {operations.map((node) => (
                  <TreeNodeWidget key={node.id} node={node} />
                ))}
                {props.extra}
              </Fragment>
              <View {...createNodeId(designer, ensureObjectItemsNode(node).id)}>
                {children.length ? (
                  children.map((node) => (
                    <TreeNodeWidget key={node.id} node={node} />
                  ))
                ) : (
                  <DroppableWidget hasChildren={false} />
                )}
              </View>
            </View>
          </View>
        </ArrayBase.Item>
        {additions.map((node) => (
          <TreeNodeWidget key={node.id} node={node} />
        ))}
      </ArrayBase>
    )
  }

  return (
    <div {...nodeId} className="dn-array-cards">
      {renderCard()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addIndex'),
            icon: 'AddIndex',
            onClick: () => {
              if (
                hasNodeByComponentPath(node, [
                  'ArrayItems',
                  '*',
                  'ArrayItems.Index',
                ])
              )
                return
              const indexNode = new TreeNode({
                componentName: node.componentName,
                props: {
                  type: 'void',
                  'x-component': 'ArrayItems.Index',
                },
              })
              ensureObjectItemsNode(node).append(indexNode)
            },
          },

          {
            title: node.getMessage('addOperation'),
            icon: 'AddOperation',
            onClick: () => {
              const oldAdditionNode = findNodeByComponentPath(node, [
                'ArrayItems',
                'ArrayItems.Addition',
              ])
              if (!oldAdditionNode) {
                const additionNode = new TreeNode({
                  componentName: node.componentName,
                  props: {
                    type: 'void',
                    title: 'Addition',
                    'x-component': 'ArrayItems.Addition',
                  },
                })
                ensureObjectItemsNode(node).insertAfter(additionNode)
              }
              const oldRemoveNode = findNodeByComponentPath(node, [
                'ArrayItems',
                '*',
                'ArrayItems.Remove',
              ])
              const oldMoveDownNode = findNodeByComponentPath(node, [
                'ArrayItems',
                '*',
                'ArrayItems.MoveDown',
              ])
              const oldMoveUpNode = findNodeByComponentPath(node, [
                'ArrayItems',
                '*',
                'ArrayItems.MoveUp',
              ])
              if (!oldRemoveNode) {
                ensureObjectItemsNode(node).append(
                  new TreeNode({
                    componentName: node.componentName,
                    props: {
                      type: 'void',
                      'x-component': 'ArrayItems.Remove',
                    },
                  })
                )
              }
              if (!oldMoveDownNode) {
                ensureObjectItemsNode(node).append(
                  new TreeNode({
                    componentName: node.componentName,
                    props: {
                      type: 'void',
                      'x-component': 'ArrayItems.MoveDown',
                    },
                  })
                )
              }
              if (!oldMoveUpNode) {
                ensureObjectItemsNode(node).append(
                  new TreeNode({
                    componentName: node.componentName,
                    props: {
                      type: 'void',
                      'x-component': 'ArrayItems.MoveUp',
                    },
                  })
                )
              }
            },
          },
        ]}
      />
    </div>
  )
})

ArrayBase.mixin(ArrayItems)

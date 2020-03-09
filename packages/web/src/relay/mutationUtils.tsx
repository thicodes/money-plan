import { ConnectionHandler } from 'relay-runtime';
import { isObject, isArray } from 'lodash/fp';

import { Store, RecordProxy, RecordSourceSelectorProxy } from 'relay-runtime';

type ListRecordRemoveUpdaterOptions = {
  parentId: string;
  itemId: string;
  parentFieldName: string;
  store: Store;
};

type ListRecordAddUpdaterOptions = {
  parentId: string;
  item: Object;
  type: string;
  parentFieldName: string;
  store: Store;
};

type OptimisticConnectionUpdaterOptions = {
  parentId: string;
  store: Store;
  connectionName: string;
  item: Object;
  customNode: any | null;
  itemType: string;
};

type ConnectionDeleteEdgeUpdaterOptions = {
  parentId: string;
  connectionName: string;
  nodeId: string;
  store: Store;
};

type CopyObjScalarsToProxyOptions = {
  object: Object;
  proxy: RecordProxy;
};

export function listRecordRemoveUpdater({ parentId, itemId, parentFieldName, store }: ListRecordRemoveUpdaterOptions) {
  const parentProxy = store.get(parentId);
  const items = parentProxy.getLinkedRecords(parentFieldName);

  parentProxy.setLinkedRecords(items.filter(record => record._dataID !== itemId), parentFieldName);
}

export function listRecordAddUpdater({ parentId, item, type, parentFieldName, store }: ListRecordAddUpdaterOptions) {
  const node = store.create(item.id, type);

  Object.keys(item).forEach(key => {
    node.setValue(item[key], key);
  });

  const parentProxy = store.get(parentId);
  const items = parentProxy.getLinkedRecords(parentFieldName);

  parentProxy.setLinkedRecords([...items, node], parentFieldName);
}

interface ConnectionUpdaterParams {
  store: RecordSourceSelectorProxy;
  parentId: string;
  connectionName: string;
  edge: any;
  before?: boolean;
  filters?: object;
  cursor?: string;
}
export function connectionUpdater({
  store,
  parentId,
  connectionName,
  edge,
  before,
  filters,
  cursor,
}: ConnectionUpdaterParams) {
  if (edge) {
    if (!parentId) {
      // eslint-disable-next-line no-console
      console.log('maybe you forgot to pass a parentId: ');
      return;
    }

    const parentProxy = store.get(parentId);

    const connection = ConnectionHandler.getConnection(parentProxy, connectionName, filters);

    if (!connection) {
      // eslint-disable-next-line no-console
      console.log('maybe this connection is not in relay store yet:', connectionName);
      return;
    }

    const newEndCursorOffset = connection.getValue('endCursorOffset');
    connection.setValue(newEndCursorOffset + 1, 'endCursorOffset');

    const newCount = connection.getValue('count');
    connection.setValue(newCount + 1, 'count');

    if (before) {
      ConnectionHandler.insertEdgeBefore(connection, edge, cursor);
    } else {
      ConnectionHandler.insertEdgeAfter(connection, edge, cursor);
    }
  }
}

export function optimisticConnectionUpdater({
  parentId,
  store,
  connectionName,
  item,
  customNode,
  itemType,
}: OptimisticConnectionUpdaterOptions) {
  const node = customNode || store.create(item.id, itemType);

  !customNode &&
    Object.keys(item).forEach(key => {
      node.setValue(item[key], key);
    });

  const edge = store.create('client:newEdge:' + node._dataID.match(/[^:]+$/)[0], `${itemType}Edge`);
  edge.setLinkedRecord(node, 'node');

  connectionUpdater(store, parentId, connectionName, edge);
}

export function connectionDeleteEdgeUpdater({
  parentId,
  connectionName,
  nodeId,
  store,
}: ConnectionDeleteEdgeUpdaterOptions) {
  const parentProxy = store.get(parentId);
  const conn = ConnectionHandler.getConnection(parentProxy, connectionName);

  if (!conn) {
    // eslint-disable-next-line
    console.warn(`Connection ${connectionName} not found on ${parentId}`);
    return;
  }

  ConnectionHandler.deleteNode(conn, nodeId);
}

export function copyObjScalarsToProxy({ object, proxy }: CopyObjScalarsToProxyOptions) {
  Object.keys(object).forEach(key => {
    if (isObject(object[key]) || isArray(object[key])) return;
    proxy.setValue(object[key], key);
  });
}

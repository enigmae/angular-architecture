import { Injectable } from '@angular/core';

import {
  RequestInfo,
  RequestInfoUtilities,
  ParsedRequestUrl
} from 'angular-in-memory-web-api';

import { Customer } from './model/customer';
import { Order } from './model/order';

/** In-memory database data */
interface Db {
  [collectionName: string]: any[];
}

@Injectable()
export class InMemoryDataService {
  
  /** True if in-mem service is intercepting; all requests pass thru when false. */
  active = true;
  maxId = 0;

  /** In-memory database data */
  db: Db = {};

  /** Create the in-memory database on start or by command */
  createDb(reqInfo?: RequestInfo) {
    this.db = getDbData();

    if (reqInfo) {
      const body = reqInfo.utils.getJsonBody(reqInfo.req) || {};
      if (body.clear === true) {
        // tslint:disable-next-line:forin
        for (const coll in this.db) {
          this.db[coll].length = 0;
        }
      }

      this.active = !!body.active;
    }
    return this.db;
  }

  /**
   * Simulate generating new Id on the server
   * All collections in this db have numeric ids.
   * Seed grows by highest id seen in any of the collections.
   */
  genId(collection: { id: number }[], collectionName: string) {
    this.maxId =
      1 +
      collection.reduce((prev, cur) => Math.max(prev, cur.id || 0), this.maxId);
    return this.maxId;
  }

  /**
   * Override `parseRequestUrl`
   * Manipulates the request URL or the parsed result.
   * If in-mem is inactive, clear collectionName so that service passes request thru.
   * If in-mem is active, after parsing with the default parser,
   * @param url from request URL
   * @param utils for manipulating parsed URL
   */
  parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
    const parsed = utils.parseRequestUrl(url);
    parsed.collectionName = this.active
      ? mapCollectionName(parsed.collectionName)
      : undefined;
    return parsed;
  }
}

function mapCollectionName(name: string): string {
  return (
    ({
      customer: 'customers',
      order: 'orders'
    } as any)[name] || name
  );
}

/**
 * Sample data
 */
function getDbData() {
  const customers: Customer[] = [
    {
      "id": 1,
      "name": "Ted James",
      "city": "Phoenix",
      "orderTotal": 40.99
    },
    {
      "id": 2,
      "name": "Michelle Thompson",
      "city": "Los Angeles",
      "orderTotal": 89.99
    },
    {
      "id": 3,
      "name": "James Thomas",
      "city": "Las Vegas",
      "orderTotal": 29.99
    },
    {
      "id": 4,
      "name": "Tina Adams",
      "city": "Seattle",
      "orderTotal": 15.99
    }
  ];

  const orders: Order[] = [
    {
      "id": 1,
      "customerId": 1,
      "orderItems": [
        { "id": 1, "productName": "Baseball", "itemCost": 9.99 },
        { "id": 2, "productName": "Bat", "itemCost": 19.99 }
      ]
    },
    {
      "id": 2,
      "customerId": 2,
      "orderItems": [
        { "id": 3, "productName": "Basketball", "itemCost": 7.99 },
        { "id": 4, "productName": "Shoes", "itemCost": 199.99 }
      ]
    },
    {
      "id": 3,
      "customerId": 3,
      "orderItems": [
        { "id": 5, "productName": "Frisbee", "itemCost": 2.99 },
        { "id": 6, "productName": "Hat", "itemCost": 5.99 }
      ]
    },
    {
      "id": 4,
      "customerId": 4,
      "orderItems": [
        { "id": 7, "productName": "Boomerang", "itemCost": 29.99 },
        { "id": 8, "productName": "Helmet", "itemCost": 19.99 },
        { "id": 9, "productName": "Kangaroo Saddle", "itemCost": 179.99 }
      ]
    },
    {
      "id": 5,
      "customerId": 5,
      "orderItems": [
        { "id": 10, "productName": "Budgie Smugglers", "itemCost": 19.99 },
        { "id": 11, "productName": "Swimming Cap", "itemCost": 5.49 }
      ]
    },
    {
      "id": 6,
      "customerId": 6,
      "orderItems": [
        { "id": 12, "productName": "Bow", "itemCost": 399.99 },
        { "id": 13, "productName": "Arrows", "itemCost": 69.99 }
      ]
    },
    {
      "id": 7,
      "customerId": 7,
      "orderItems": [
        { "id": 14, "productName": "Baseball", "itemCost": 9.99 },
        { "id": 15, "productName": "Bat", "itemCost": 19.99 }
      ]
    },
    {
      "id": 8,
      "customerId": 8,
      "orderItems": [
        { "id": 16, "productName": "Surfboard", "itemCost": 299.99 },
        { "id": 17, "productName": "Wax", "itemCost": 5.99 },
        { "id": 18, "productName": "Shark Repellent", "itemCost": 15.99 }
      ]
    },
    {
      "id": 9,
      "customerId": 9,
      "orderItems": [
        { "id": 19, "productName": "Saddle", "itemCost": 599.99 },
        { "id": 20, "productName": "Riding cap", "itemCost": 79.99 }
      ]
    },
    {
      "id": 10,
      "customerId": 10,
      "orderItems": [
        { "id": 21, "productName": "Baseball", "itemCost": 9.99 },
        { "id": 22, "productName": "Bat", "itemCost": 19.99 }
      ]
    }
  ]

  return { customers, orders } as Db;
}
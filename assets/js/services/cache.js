import {map} from "core-js/internals/array-iteration";

const cache = {};

function set(key, data){
    cache[key] = {
        data,
        expireAt: new Date().getTime()
    };
}

function get(key){
   return new Promise(resolve => {
       resolve(
           cache[key] && cache[key].expireAt + (15 * 60 * 1000) > new Date().getTime() ?
               cache[key].data:
               null
       );
   });
}

function invalidate(key){
    delete cache[key];
}

function destroyAll(){
    for (const key in cache) {
        delete cache[key];
    }
}

export default {
    set,
    get,
    invalidate,
    destroyAll
}
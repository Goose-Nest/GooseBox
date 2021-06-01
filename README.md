# GooseBox (GEx2)

**Experimental** JS sandbox for browser.


## Concept

Enables JS to be evaluated with a restricted global scope to allow a basic level of sandboxing.

### Example Use-case

An example use-case of this is to disallow network access to some JS code. We do this by removing the main functions used for network requests: `fetch` and `XMLHTTPRequest`, making it near impossible for the code to make network requests.


## Permission Structure

### Core

The core of the permission structure is a restrictive by default policy (which can be disabled via an argument), eg: if no permissions are given to the sandbox it presumes it should be given 0. It also makes it easy to add new permissions to the source via just adding simple objects to the main array.

## Permission Object

The permission object is quite simple: having a name and then props. The name is what should be given to the sandbox so it can find the correct permission object. The props is what properties to remove from the global scope if it shouldn't be allowed.
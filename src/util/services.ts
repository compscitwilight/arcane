import { pmServices } from "..";

export type ServiceMethod = 
    "install_package" |
    "list_installed_packages" |
    "search" |
    "remove_package" |
    "upgrade_package" |
    "upgrade_all_packages" |
    "remove_group" |
    "get_package_information"

/**
 * Invokes a method from the package manager service specified by `name`.
 */
export async function invokeServiceMethod(serviceID: number, methodName: ServiceMethod, ...args: any[]) {
    const serviceFile = pmServices.get(serviceID);
    return new Promise<[res: any | undefined, err: Error | undefined]>(async (resolve, reject) => {
        try {
            var res = await serviceFile[methodName](...args);
            resolve([res, undefined]);
        } catch (err) {
            resolve([undefined, err]);
            reject(err.message);
        }
    })
}

/**
 * Validates each of the registered package manager services for method
 * definitions. This is invoked at runtime.
 */
export function validateRegisteredServices(services?: typeof pmServices) {
    const target = services || pmServices;
    
}
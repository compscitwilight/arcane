import * as child from "node:child_process";
import { state } from "..";
import { Package } from "../types/PackageManagers";

const DNFPackageInfoKeys = ["Name", "Epoch", "Version",
                            "Release", "Architecture", "Size",
                            "Source", "Repository", "FromRepo",
                            "Summary", "URL", "License",
                            "Description"]
interface DNFPackageInformation {
    Name: string,
    Epoch: number,
    Version: string,
    Release: string,
    Architecture: string,
    Size: string,
    Source: string,
    Repository: string,
    FromRepo: string,
    Summary: string,
    URL: string,
    License: string,
    Description: string
};

/**
 * Installs a package using the DNF (dandified yum) package manager.
 * @param name The name of the package which will be installed.
 * @param version The version of the package.
 */
export function install_package(name: string, version?: string) {

}

/**
 * Returns a list of all of the installed packages using the DNF package
 * manager.
 */
export async function list_installed_packages() {
    return new Promise<Array<Package>>((resolve, reject) => {
        child.exec("dnf list installed", (err: child.ExecException, stdout: string) => {
            if (err) throw new Error(err.message);
            const lines = stdout.split("\n");
            const packageLines = lines.map((l) => l.replace(/\s+/g, ' ') ).slice(0, -1);
            var packages = new Array<Package>();
            for (var i = 0; i < packageLines.length; i++) {
                if (i !== 0) {
                    const groups = packageLines[i].split(" ");
                    packages.push({
                        name: groups[0],
                        summary: state.getPackageSummaries ?
                            child.execSync(`rpm -q --queryformat "%{SUMARY}" ${groups[0]}"`).toString() :
                            undefined,
                        version: groups[1],
                        group: groups[2].replace("@", "")
                    } as Package);
                }
            }
            resolve(packages);
        })
    })
}

/**
 * Returns extra package information about the specified package.
 */
export async function get_package_information(packageName: string) {
    return new Promise<{}>((resolve, reject) => {
        const info = {} as DNFPackageInformation;
        const output = child.execSync(`dnf info ${packageName}`).toString();
        output.split("\n").forEach((ln) => {
            if (DNFPackageInfoKeys.includes(ln))
                console.log(ln);
        })
        //console.log(output.slice(0, output.indexOf("Name") - 1));
        resolve({})
        //resolve(output);
    })
}

/**
 * Searches the DNF repositories for packages with the query provided.
 * @param query Search term(s).
 */
export function search(query: string) {

}

/**
 * Removes the installed package with the provided name using the DNF package
 * manager.
 * @param name The name of the package which will be removed.
 */
export function remove_package(name: string) {

}

/**
 * Upgrades the installed package with the provided name using the DNF package
 * manager.
 * @param name The name of the package which will be upgraded.
 */
export function upgrade_package(name: string) {

}

/**
 * Upgrades all installed packages using the DNF package manager.
 */
export function upgrade_all_packages() {

}

/**
 * Removes an installed/registered group using the DNF package manager.
 * @param name The name of the group which will be removed.
 */
export function remove_group(name: string) {

}
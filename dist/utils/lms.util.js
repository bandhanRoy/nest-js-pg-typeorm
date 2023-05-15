"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUpResponse = void 0;
const deleteKeys = ['_links'];
const responsePathRewriteMap = {
    'https://yml.developer.infuse.myabsorb.com/api/rest/v2': 'http://localhost:4000/v1/api/lms',
    'https://yml.developer.infuse.myabsorb.com/Files/Public': 'http://localhost:4000/v1/api/lms/file/public',
    'https://yml.developer.infuse.myabsorb.com/Files/Private': 'http://localhost:4000/v1/api/lms/file/private',
};
const cleanUpResponse = (response) => {
    for (const key of Object.keys(response)) {
        if (deleteKeys.includes(key))
            delete response[key];
        if (key === '_embedded') {
            response['result'] = response[key];
            delete response[key];
            if (typeof response['result'] === 'object' &&
                response['result'] &&
                Object.keys(response['result']).length > 0) {
                Object.keys(response['result']).forEach((key) => {
                    const arr = response['result'][key];
                    if (Array.isArray(arr)) {
                        arr.forEach((obj) => (obj = (0, exports.cleanUpResponse)(obj)));
                    }
                });
            }
        }
        if (typeof response[key] === 'string') {
            Object.keys(responsePathRewriteMap).forEach((pKey) => {
                response[key] = response[key]
                    .split(pKey)
                    .join(responsePathRewriteMap[pKey]);
            });
        }
    }
    return response;
};
exports.cleanUpResponse = cleanUpResponse;
//# sourceMappingURL=lms.util.js.map
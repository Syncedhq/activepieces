import { createAction, Property } from "@activepieces/pieces-framework";
import { httpClient, HttpMethod, AuthenticationType } from "@activepieces/pieces-common";
import { oneDriveAuth } from "../../";
import { oneDriveCommon } from "../common/common";

export const listFolders = createAction({
    auth: oneDriveAuth,
    name: 'list_onedrive_folders',
    description: 'List folders in a OneDrive folder',
    displayName: 'List Folders',
    props: {
        parentFolder: Property.ShortText({
            displayName: 'Parent Folder ID',
            description: 'The ID of the parent folder',
            required: false,
        }),
    },
    async run(context) {
        const parentId = context.propsValue.parentFolder ?? 'root';

        const result = await httpClient.sendRequest({
            method: HttpMethod.GET,
            url: `${oneDriveCommon.baseUrl}/items/${parentId}/children?$filter=folder ne null`,
            authentication: {
                type: AuthenticationType.BEARER_TOKEN,
                token: context.auth.access_token,
            }
        });

        return result.body["value"];
    }
});
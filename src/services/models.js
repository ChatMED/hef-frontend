import instance from "@/axios/axios.js";
import {getSelectedWorkspaceId} from "@/services/workspaces.js";

export const getModels = async () => {
    return instance.get(`/api/models?workspaceId=${getSelectedWorkspaceId()}`);
}
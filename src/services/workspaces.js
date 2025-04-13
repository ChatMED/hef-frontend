import instance from "@/axios/axios.js";

const WORKSPACE_ID_KEY = "workspaceId";

export const getWorkspaces = async () => {
    return instance.get("/api/workspaces");
}

export const selectWorkspace = (workspaceId) => {
    localStorage.setItem(WORKSPACE_ID_KEY, workspaceId);
}

export const getSelectedWorkspaceId = () => {
    return localStorage.getItem(WORKSPACE_ID_KEY);
}
import instance from "@/axios/axios.js";
import {getSelectedWorkspaceId} from "@/services/workspaces.js";

export const getQuestionForEvaluation = async (modelId) => {
    const user = localStorage.getItem("user")
    let url = `/api/questions/${user}?workspaceId=${getSelectedWorkspaceId()}`
    if(modelId) {
        url += `&modelId=${modelId}`
    }

    return instance.get(url);
}

export const goToNextQuestion = async () => {
    const user = localStorage.getItem("user")
    return instance.post(`/api/questions/next/${user}?workspaceId=${getSelectedWorkspaceId()}`)
}

export const goToPrevQuestion = async () => {
    const user = localStorage.getItem("user")
    return instance.post(`/api/questions/prev/${user}?workspaceId=${getSelectedWorkspaceId()}`)
}
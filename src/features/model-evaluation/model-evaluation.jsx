import {Box, Button, Stack, Typography} from "@mui/material";
import {ModelResponse} from "@/features/model-evaluation/model-response.jsx";

export const ModelEvaluation = ({question, answer, allModels, evaluatedModels, evaluation, setEvaluation, metricsRef}) => {
    const validateEvaluation = (evaluationData) => {
        if (!evaluationData || Object.keys(evaluationData).length === 0) return false;

        const requiredFields = [
            "accuracy", "comprehensiveness", "clarity", "empathy",
            "bias", "harm", "trust", "relevance", "currency",
            "securityAndPrivacy", "perceivedUsefulness"
        ];
        const missingFields = requiredFields.filter(field =>
            evaluationData[field] === undefined || evaluationData[field] === null || evaluationData[field] === ""
        );
        return missingFields.length === 0;
    };

    return (<Stack maxWidth={"lg"} direction={"column"} fullWidth gap={2} sx={{flex: 1, pb: 20}}>
        <Box sx={{py: 0, px: 1}}>
            <Typography align={"left"} fontWeight={600}>Question:</Typography>
            <Typography align={"left"}>{question?.text}</Typography>
        </Box>
        <Stack direction={"row"} useFlexGap flexWrap={"wrap"} gap={1} sx={{px: 1}}>
            {allModels?.map(model => {
                return (<Button key={model}
                                variant={evaluatedModels?.some(e => e.name === model.name) ? "contained" : "outlined"}>{model?.name}</Button>)
            })}
        </Stack>

        <Box sx={{flex: 1}}>
            <ModelResponse
                modelResponse={answer}
                evaluation={evaluation}
                onUpdate={(key, value) => setEvaluation(prev => {
                    const newEvaluation = {...prev};
                    newEvaluation[key] = value;
                    newEvaluation["isValid"] = validateEvaluation(newEvaluation);
                    return newEvaluation;
                })}
                metricsRef={metricsRef}
            />

            <Typography fontSize={"small"} align={"center"} sx={{p: 1}}>
                * When you fill-in all metrics the 'Save & Continue to next question' button will become available.
            </Typography>
        </Box>
    </Stack>)
}

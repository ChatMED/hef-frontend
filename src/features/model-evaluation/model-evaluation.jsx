import {Box, Button, Stack, Typography} from "@mui/material";
import {ModelResponse} from "@/features/model-evaluation/model-response.jsx";

export const ModelEvaluation = ({
                                    question,
                                    answer,
                                    allModels,
                                    currentModel,
                                    evaluatedModels,
                                    evaluation,
                                    setEvaluation,
                                    setCurrentModel,
                                    metricsRef,
                                    answerRef
                                }) => {
    const validateEvaluation = (evaluationData) => {
        if (!evaluationData || Object.keys(evaluationData).length === 0) return false;

        const requiredFields = ["accuracy", "comprehensiveness", "clarity", "empathy", "bias", "harm", "trust", "relevance", "currency", "securityAndPrivacy", "perceivedUsefulness"];
        const missingFields = requiredFields.filter(field => evaluationData[field] === undefined || evaluationData[field] === null || evaluationData[field] === "");
        return missingFields.length === 0;
    };

    const handleModelClick = (model) => {
        setCurrentModel(model);
    };

    return (<Stack maxWidth={"lg"} direction={"column"} fullWidth gap={2} sx={{flex: 1, pb: 20}}>
        <Box sx={{py: 0, px: 1}}>
            <Typography align={"left"} fontWeight={600}>Question {question?.id}:</Typography>
            <Typography align={"left"}>{question?.text}</Typography>
        </Box>
        <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} sx={{px: 1}}>
            {allModels.map((model) => {
                const isEvaluated = evaluatedModels.some((e) => e?.name === model?.name);
                const isCurrent = currentModel?.name === model?.name;

                return (<Button
                    key={model?.name}
                    variant={isCurrent ? "contained" : isEvaluated ? "contained" : "outlined"}
                    color={isCurrent ? "warning" : isEvaluated ? "primary" : "secondary"}
                    sx={{
                        backgroundColor: isCurrent ? "#B2527C" : undefined,
                        color: isCurrent ? "#FFFFFF" : undefined,
                        "&:hover": {
                            backgroundColor: isCurrent ? "#B2527C" : undefined,
                        },
                    }}
                    onClick={isEvaluated || isCurrent ? () => handleModelClick(model) : undefined}
                    disabled={!isEvaluated && !isCurrent}
                >
                    {model?.name}
                </Button>);
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
                answerRef={answerRef}
            />

            <Typography fontSize={"small"} align={"center"} sx={{p: 1}}>
                * When you fill-in all metrics the 'Save' and 'Save and Continue to next unevaluated question' buttons become available.
            </Typography>
        </Box>
    </Stack>)
}

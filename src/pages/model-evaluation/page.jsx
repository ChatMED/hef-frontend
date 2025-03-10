import {ModelEvaluation} from "../../features/model-evaluation/model-evaluation.jsx";
import {Box, Button, CircularProgress, LinearProgress, Stack, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {IconChevronRight} from "@tabler/icons-react";
import axios from "@/axios/axios.js";
import {useAppContext} from "@/context/app-context.jsx";
import {useAuthContext} from "@/context/auth-context.jsx";
import {LoadingScreen} from "@/components/loading-screen/LoadingScreen.jsx";

export const ModelEvaluationPage = () => {
    const {user} = useAuthContext();
    const {state, dispatch} = useAppContext();
    const {currentQuestionForEvaluation, models} = state || {};
    const [question, setQuestion] = useState({});
    const [evaluation, setEvaluation] = useState({});
    const [prev] = useState(null);
    const [currentIndex] = useState(0);
    const metricsRef = useRef(null);

    useEffect(() => {
        setQuestion(currentQuestionForEvaluation);
    }, [currentQuestionForEvaluation?.question?.id]);

    const onSaveAndPersist = async () => {
        setEvaluation({...evaluation})

        if (evaluation?.isValid) {
            evaluation["answer"] = currentQuestionForEvaluation?.answer?.id;
            evaluation["username"] = user

            await axios.post("/api/evaluations", evaluation)
                .then(() => axios.get(`/api/questions/${user}`)
                    .then(response => {
                        dispatch({responses: response.data || [], currentQuestionForEvaluation: response.data || {}});
                        setEvaluation({})
                    })
                    .catch(error => console.log(error)));
        }
    }

    const smoothScrollToTop = (duration = 500) => {
        const start = window.scrollY || document.documentElement.scrollTop;
        const startTime = performance.now();

        function scrollStep(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = progress * (2 - progress); // Ease-out effect

            window.scrollTo(0, start * (1 - easeOut));
            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            }
        }
        requestAnimationFrame(scrollStep);
    }

    const onNext = async () => {
        await onSaveAndPersist({...evaluation});
        smoothScrollToTop();

        metricsRef.current.scrollTo({top: 0, behavior: "smooth"});
    }

    const evaluatedQuestions = currentQuestionForEvaluation?.evaluatedQuestions;
    const remainingQuestions = currentQuestionForEvaluation?.remainingQuestions;
    const totalQuestions = evaluatedQuestions + remainingQuestions;
    const percentageLeft = Math.round((remainingQuestions / totalQuestions) * 100)
    return (
        <>
            <LinearProgress variant={"buffer"} value={(100 - percentageLeft) || 0}
                            valueBuffer={((100 - percentageLeft) || 0) + 5}
                            sx={{position: "fixed", top: 0, left: 0, right: 0}}/>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    py: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #d1d1d1",
                        backgroundColor: "#f8f9fa",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        minWidth: "250px",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#252525",
                            fontWeight: "500",
                            fontSize: "14px",
                            textAlign: "center",
                        }}
                    >
                        You have evaluated {evaluatedQuestions} / {totalQuestions} questions.
                    </Typography>
                </Box>
            </Box>
            {
                currentQuestionForEvaluation?.question?.id ?
                    <ModelEvaluation question={currentQuestionForEvaluation?.question}
                                     answer={currentQuestionForEvaluation?.answer}
                                     evaluatedModels={currentQuestionForEvaluation?.evaluatedModels}
                                     allModels={models}
                                     evaluation={evaluation}
                                     setEvaluation={setEvaluation}
                                     metricsRef={metricsRef}/> :
                    <Box sx={{flex: 1}}>
                        <LoadingScreen/>
                    </Box>
            }
            <Stack direction={"column"} gap={2}
                   sx={{position: "fixed", bottom: 0, px: 1, left: 0, right: 0, bgcolor: "background.main",}}>
                <Stack maxWidth={"lg"} direction={"row"} gap={2}
                       useFlexGap flexWrap={"wrap"}
                       sx={{
                           bgcolor: "background.main",
                           borderTop: 1,
                           borderColor: "divider",
                           py: 2,
                           width: "100%",
                           mx: "auto"
                       }}>
                    <Button
                        variant={"contained"}
                        sx={{
                            flex: 5,
                            boxShadow: 0,
                            borderRadius: 2,
                            minWidth: "200px",
                            color: "#fefefe !important",
                            bgcolor: evaluation?.isValid ? "primary.main" : "grey.400",
                            "&:hover": {
                                bgcolor: evaluation?.isValid ? "primary.dark" : "grey.500"
                            }
                        }}
                        endIcon={<IconChevronRight size={18}/>}
                        onClick={onNext}
                        disabled={!evaluation?.isValid}
                    >
                        Save & Continue to next question
                    </Button>
                </Stack>
            </Stack>
        </>
    );
};

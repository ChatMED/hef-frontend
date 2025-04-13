import {ModelEvaluation} from "../../features/model-evaluation/model-evaluation.jsx";
import {Box, Button, LinearProgress, Stack, Typography} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {IconChevronLeft, IconChevronRight, IconDeviceFloppy} from "@tabler/icons-react";
import axios from "@/axios/axios.js";
import {useAppContext} from "@/context/app-context.jsx";
import {useAuthContext} from "@/context/auth-context.jsx";
import {LoadingComponent} from "@/pages/loading-screen/loadingComponent.jsx";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from "react-router-dom";
import {getQuestionForEvaluation, goToNextQuestion, goToPrevQuestion} from "@/services/questions.js";
import {getModels} from "@/services/models.js";
import {Header} from "@/pages/header/page.jsx";


export const ModelEvaluationPage = () => {
    const {user, onLogout} = useAuthContext();
    const {state, dispatch} = useAppContext();
    const [loading, setLoading] = useState(false);
    const {currentQuestionForEvaluation, models} = state || {};
    const [question, setQuestion] = useState({});
    const [currentModel, setCurrentModel] = useState();
    const [evaluation, setEvaluation] = useState({});
    const [prefillTriggered, setPrefillTriggered] = useState(false);
    const metricsRef = useRef(null);
    const answerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getQuestionForEvaluation(null)
            .then(questionResponse => {
                dispatch({
                    currentQuestionForEvaluation: questionResponse?.data || {}
                });
            })
            .catch(error => {
                console.log(error)
                dispatch({currentQuestionForEvaluation: {}})
            }).finally(() => setLoading(false));

        getModels().then(modelsResponse => {
            dispatch({models: modelsResponse?.data});
        }).catch(error => console.log(error))

    }, [])

    useEffect(() => {
        setQuestion(currentQuestionForEvaluation);

        let oldEvaluation = currentQuestionForEvaluation?.evaluation;
        if (oldEvaluation) oldEvaluation["isValid"] = true;
        setEvaluation(oldEvaluation);
        setPrefillTriggered(validateEvaluation(oldEvaluation));

        setCurrentModel(currentQuestionForEvaluation?.answer?.model);
    }, [currentQuestionForEvaluation?.question?.id]);

    useEffect(() => {
        if (currentModel !== undefined && currentModel !== null) {
            getQuestionForEvaluation(currentModel?.id)
                .then((response) => {
                    dispatch({currentQuestionForEvaluation: response.data || {}});
                    setQuestion(response?.data);

                    let oldEvaluation = response?.data?.evaluation;
                    if (oldEvaluation) oldEvaluation["isValid"] = true;
                    setEvaluation(oldEvaluation);
                    setPrefillTriggered(validateEvaluation(oldEvaluation));
                }).catch((error) => {
                console.log(error);
            });
        }
    }, [currentModel?.id]);

    const onSaveAndPersist = async (goToNextUnevaluatedQuestion = false) => {
        setEvaluation({...evaluation});

        if (evaluation?.isValid) {
            evaluation["answer"] = currentQuestionForEvaluation?.answer?.id;
            evaluation["username"] = user;

            await axios.post(`/api/evaluations?goToNextUnevaluatedQuestion=${goToNextUnevaluatedQuestion}`, evaluation)
                .then(() => {
                    toast.success('Evaluation saved successfully!', {
                        icon: '💾', autoClose: 1500, style: {
                            background: "whitesmoke",
                            color: "#58A7BF",
                            borderRadius: "7px",
                            fontSize: "13px",
                            padding: "5px 5px"
                        }, progressStyle: {background: "#58A7BF"}
                    });

                    let modelId = goToNextUnevaluatedQuestion ? '' : currentModel?.id;
                    getQuestionForEvaluation(modelId)
                        .then(response => {
                            dispatch({
                                responses: response?.data || [], currentQuestionForEvaluation: response?.data || {}
                            });
                            if (goToNextUnevaluatedQuestion) setEvaluation({}); else {
                                let oldEvaluation = response?.data?.evaluation;
                                if (oldEvaluation) oldEvaluation["isValid"] = true;
                                setEvaluation(oldEvaluation);
                            }
                            setCurrentModel(response?.data?.answer?.model);
                        })
                        .catch(error => console.log(error));
                })
                .catch(error => console.log(error));
        }
        smoothScrollToTop();

        setTimeout(() => {
            if (answerRef.current) answerRef.current.scrollTop = 0;
            if (metricsRef.current) metricsRef.current.scrollTop = 0;
        }, 100);
    };

    const smoothScrollToTop = (duration = 500) => {
        const start = window.scrollY || document.documentElement.scrollTop;
        const startTime = performance.now();

        function scrollStep(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = progress * (2 - progress);

            window.scrollTo(0, start * (1 - easeOut));
            if (progress < 1) requestAnimationFrame(scrollStep);
        }

        requestAnimationFrame(scrollStep);
    };

    const ifCompletedFinishEvaluating = () => {
        if ((currentQuestionForEvaluation?.remainingQuestions === 0 && currentQuestionForEvaluation?.evaluatedModels.length === models.length) || (currentQuestionForEvaluation?.remainingQuestions === 1 && currentQuestionForEvaluation?.evaluatedModels.length === models.length - 1)) {
            navigate('/thank-you');
        }
    };

    const validateEvaluation = (evaluationData) => {
        if (!evaluationData || Object.keys(evaluationData).length === 0) return false;

        const requiredFields = ["understanding", "relevance", "clarity", "reasoning", "accuracy", "comprehensiveness", "currency", "empathy", "bias", "harm", "factualityVerification"];
        const missingFields = requiredFields.filter(field => evaluationData[field] === undefined || evaluationData[field] === null || evaluationData[field] === "");
        return missingFields.length === 0;
    };

    const onNextUnevaluated = async () => {
        await onSaveAndPersist(true);
        ifCompletedFinishEvaluating();
    };

    const onPrev = async () => {
        goToPrevQuestion()
            .then(response => {
                dispatch({responses: response?.data || [], currentQuestionForEvaluation: response?.data || {}});
                let oldEvaluation = response?.data?.evaluation;
                if (oldEvaluation) oldEvaluation["isValid"] = true;
                setEvaluation(oldEvaluation);
                setPrefillTriggered(validateEvaluation(oldEvaluation));
                setCurrentModel(response?.data?.answer?.model);
            }).catch(error => console.log(error));
    };

    const onNext = async () => {
        goToNextQuestion()
            .then(response => {
                dispatch({responses: response?.data || [], currentQuestionForEvaluation: response?.data || {}});
                let oldEvaluation = response?.data?.evaluation;
                if (oldEvaluation) oldEvaluation["isValid"] = true;
                setEvaluation(oldEvaluation);
                setPrefillTriggered(validateEvaluation(oldEvaluation));
                setCurrentModel(response?.data?.answer?.model);
            }).catch(error => console.log(error));
    };

    const evaluatedQuestions = currentQuestionForEvaluation?.evaluatedQuestions;
    const remainingQuestions = currentQuestionForEvaluation?.remainingQuestions;
    const totalQuestions = evaluatedQuestions + remainingQuestions;
    const percentageLeft = Math.round((remainingQuestions / totalQuestions) * 100);

    return loading ? <LoadingComponent/> : (
        <>
            {currentQuestionForEvaluation?.question?.id && (<>
                <LinearProgress
                    variant="buffer"
                    value={(100 - percentageLeft) || 0}
                    valueBuffer={((100 - percentageLeft) || 0) + 5}
                    sx={{position: "fixed", top: 0, left: 0, right: 0}}
                />

                <Header/>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        alignItems: "center",
                        width: "100%",
                        maxWidth: "1400px",
                        pt: 1,
                        pb: 1,
                        px: 2,
                        mx: "auto",
                    }}
                >
                    <Box/>
                    <Box
                        sx={{
                            justifySelf: "center",
                            border: "2px solid #d1d1d1",
                            backgroundColor: "#f8f9fa",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            minWidth: "250px",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#252525", fontWeight: "500", fontSize: "11px", textAlign: "center",
                            }}
                        >
                            You have evaluated {evaluatedQuestions} / {totalQuestions} questions.
                        </Typography>
                    </Box>
                </Box>
            </>)}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "calc(100vh - 120px)",
                    maxWidth: "1400px",
                    width: "100%",
                    mx: "auto",
                }}
            >
                <Box sx={{flex: 1, display: "flex", flexDirection: "column", overflow: "hidden"}}>
                    {currentQuestionForEvaluation?.question?.id ? (<ModelEvaluation
                        question={currentQuestionForEvaluation?.question}
                        answer={currentQuestionForEvaluation?.answer}
                        currentModel={currentQuestionForEvaluation?.answer?.model}
                        evaluatedModels={currentQuestionForEvaluation?.evaluatedModels}
                        allModels={models}
                        evaluation={evaluation}
                        setEvaluation={setEvaluation}
                        validateEvaluation={validateEvaluation}
                        prefillTriggered={prefillTriggered}
                        setPrefillTriggered={setPrefillTriggered}
                        setCurrentModel={setCurrentModel}
                        metricsRef={metricsRef}
                        answerRef={answerRef}
                    />) : (<Box sx={{flex: 1}}>
                        <LoadingComponent/>
                    </Box>)}
                </Box>

                {currentQuestionForEvaluation?.question?.id && (<Stack
                    direction={"column"}
                    gap={2}
                    sx={{position: "fixed", bottom: 0, px: 1, left: 0, right: 0, bgcolor: "background.main"}}
                >
                    <Stack
                        maxWidth={"lg"}
                        direction={"row"}
                        gap={2}
                        useFlexGap
                        flexWrap={"wrap"}
                        sx={{
                            bgcolor: "background.main",
                            borderTop: 1,
                            borderColor: "divider",
                            py: 2,
                            width: "100%",
                            mx: "auto",
                        }}
                    >
                        <Button
                            sx={{
                                flex: 2,
                                borderRadius: 2,
                                bgcolor: "#f1efef",
                                "&:hover": {bgcolor: "#e1dfdf !important"},
                            }}
                            startIcon={<IconChevronLeft size={18}/>}
                            onClick={onPrev}
                            disabled={currentQuestionForEvaluation?.evaluatedQuestions === 0 || currentQuestionForEvaluation?.question?.questionKey === 0}
                        >
                            Back
                        </Button>

                        <Button
                            variant={"text"}
                            sx={{
                                flex: 2,
                                borderRadius: 2,
                                bgcolor: "#f1efef",
                                "&:hover": {bgcolor: "#e1dfdf !important"},
                            }}
                            startIcon={<IconDeviceFloppy size={18}/>}
                            onClick={() => onSaveAndPersist()}
                            disabled={!evaluation?.isValid}
                        >
                            Save
                        </Button>

                        <Button
                            variant={"text"}
                            sx={{
                                flex: 2,
                                borderRadius: 2,
                                bgcolor: "#f1efef",
                                "&:hover": {bgcolor: "#e1dfdf !important"},
                            }}
                            startIcon={<IconChevronRight size={18}/>}
                            onClick={onNext}
                            disabled={currentQuestionForEvaluation?.evaluatedModels?.length !== models?.length || currentQuestionForEvaluation?.question?.questionKey === totalQuestions - 1}
                        >
                            Next
                        </Button>

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
                                    bgcolor: evaluation?.isValid ? "primary.dark" : "grey.500",
                                },
                            }}
                            endIcon={<IconChevronRight size={18}/>}
                            onClick={onNextUnevaluated}
                            disabled={!evaluation?.isValid}
                        >
                            Save & Continue to next unevaluated question
                        </Button>
                    </Stack>
                </Stack>)}
            </Box>

            <ToastContainer position="top-right" autoClose={1500}/>
        </>);
};

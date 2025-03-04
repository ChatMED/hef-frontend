import {useEffect, useState} from "react";
import {Badge, Box, Button, Stack, Tooltip, Typography} from "@mui/material";
import {ModelResponse} from "@/features/model-evaluation/model-response.jsx";
import {useAppContext} from "@/context/app-context.jsx";
import {IconAlertTriangle} from "@tabler/icons-react";

export const ModelEvaluation = ({question, setQuestion}) => {
  const {state: {responses}} = useAppContext();
  const [models, setModels] = useState([]);
  const [model, setModel] = useState(null);

  useEffect(() => {
    if (question?.id || question?.q_id) {
      const models = [...new Set(question?.answers?.map(i => i?.model))];
      setModels(models);
      setModel(models[0] || null)
    }
  }, [question?.id, question?.q_id]);


  return (
    <Stack maxWidth={"lg"} direction={"column"} fullWidth gap={2} sx={{flex: 1, pb: 20}}>
      <Box sx={{py: 3, px: 1}}>
        <Typography align={"left"} fontWeight={600}>Question:</Typography>
        <Typography align={"left"}>{question?.text}</Typography>
      </Box>
      <Stack direction={"row"} useFlexGap flexWrap={"wrap"} gap={1} sx={{px: 1}}>
        {models?.map(modelItem => {
          const oldQuestion = responses?.find(q => q?.id === question?.id);
          let hasChanges = false;
          if (oldQuestion) {
            const oldAnswer = oldQuestion?.answers?.filter(i => i?.model === modelItem)[0] || null;
            const newAnswer = question?.answers?.filter(i => i?.model === modelItem)[0] || null;
            if (oldAnswer && newAnswer) {
              if (
                oldAnswer.accuracy !== newAnswer.accuracy ||
                oldAnswer.bias !== newAnswer.bias ||
                oldAnswer.completeness !== newAnswer.completeness ||
                oldAnswer.relevance !== newAnswer.relevance ||
                oldAnswer.safety !== newAnswer.safety ||
                oldAnswer.comment !== newAnswer.comment
              ) {
                hasChanges = true;
              }
            }
          }
          return (
            <Tooltip title={hasChanges ? "Unsaved Changes" : modelItem}>
              <Button key={modelItem} variant={modelItem === model ? "contained" : "outlined"}
                      startIcon={hasChanges ? <IconAlertTriangle size={18} color={"#e8b169"}/> : undefined}
                      onClick={() => setModel(modelItem)}>
                {modelItem}
              </Button>
            </Tooltip>
          )
        })}
      </Stack>
      <Box sx={{flex: 1}}>
        {
          question?.answers?.filter(i => i?.model === model)
            ?.map(modelResponse => {
              return (<ModelResponse
                key={modelResponse?.id} modelResponse={modelResponse}
                onUpdate={(key, value) => setQuestion(prev => {
                  const answers = [...prev?.answers];
                  const answer = answers?.find(a => a?.id === modelResponse?.id);
                  answer[key] = value;
                  return {
                    ...prev,
                    answers: answers
                  }
                })}
              />)
            })
        }
        <Typography fontSize={"small"} align={"left"} sx={{p: 1}}>
          * When you click 'Save' or 'Save & Continue,' all
          changes made in the model evaluation will be saved. If there are any unsaved changes, a sign will indicate
          that these changes have not been saved.
        </Typography>
      </Box>
    </Stack>
  )
}

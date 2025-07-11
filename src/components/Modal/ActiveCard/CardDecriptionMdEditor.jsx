import { useState } from 'react';
import { useColorScheme } from '@mui/material/styles';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EditNote from '@mui/icons-material/EditNote';

function CardDescriptionMdEditor({
  cardDescriptionProp,
  handleUpdateCardDescription,
}) {
  const { mode } = useColorScheme();
  const [markdownEditMode, setMardownEditMode] = useState(false);
  const [cardDescription, setCardDescription] = useState(cardDescriptionProp);

  const updateCardDescription = () => {
    setMardownEditMode(false);
    handleUpdateCardDescription(cardDescription);
  };
  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode ? (
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
              height={400}
              preview="edit"
            />
          </Box>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={updateCardDescription}
            className="interceptor-loading"
            type="button"
            variant="contained"
            size="small"
            color="info"
          >
            Save
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => setMardownEditMode(true)}
            type="button"
            variant="outlined"
            color="info"
            size="small"
            startIcon={<EditNote />}
          >
            Edit
          </Button>
          <Box data-color-mode={mode}>
            <MDEditor.Markdown
              source={cardDescription}
              style={{
                whiteSpace: 'pre-wrap',
                padding: cardDescription ? '10px' : '0px',
                border: cardDescription
                  ? '0.5px solid rbga(0,0,0,0.2)'
                  : 'none',
                borderRadius: '8px',
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
export default CardDescriptionMdEditor;

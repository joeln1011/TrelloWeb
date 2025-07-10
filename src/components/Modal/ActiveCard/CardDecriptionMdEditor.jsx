import { useState } from 'react';
import { useColorScheme } from '@mui/material/styles';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EditNote from '@mui/icons-material/EditNote';

const markdownValueExample = `
*\`Markdown Content Example\`*

**Hello World!**
[![](https://example.com/image.png)](https://example.com)
\`\`\`javascript
import Ract from 'react';
import ReactDom from 'react=dom';
import MDEditor from '@uiw/react-md-editor';
\`\`\`
`;

function CardDescriptionMdEditor() {
  const { mode } = useColorScheme();
  const [markdownEditMode, setMardownEditMode] = useState(false);
  const [cardDescription, setCardDescription] = useState(markdownValueExample);
  const updateCardDescription = () => {
    setMardownEditMode(false);
    console.log('Updated Card Description:', cardDescription);
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
          >
            Edit
          </Button>
          <Box data-color-mode={mode}>
            <MDEditor.Markdown
              source={cardDescription}
              style={{
                whiteSpace: 'pre-wrap',
                padding: '10px',
                border: '0.5px solid rbga(0,0,0,0.2)',
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

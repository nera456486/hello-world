import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Paper
} from '@mui/material';

const FeedbackRead = ({ feedback }) => {
  if (!feedback || feedback.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        У вас пока нет отправленных отзывов
      </Typography>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Ваши отзывы
      </Typography>
      <List>
        {feedback
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((item) => (
            <React.Fragment key={item.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={item.text}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        display="block"
                      >
                        {new Date(item.date).toLocaleString()}
                      </Typography>
                      {item.adminReply && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 1, fontStyle: 'italic' }}
                        >
                          Ответ администратора: {item.adminReply}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
      </List>
    </Paper>
  );
};

export default FeedbackRead;

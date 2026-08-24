import express from 'express';
import * as chatController from '../controllers/chatController';
import { validateBody, validateQuery, validateParams, validate } from '../middleware/validate';
import {
  chatMessageSchema,
  onboardingSchema,
  bugTraceSchema,
  commitStorySchema,
  prReviewSchema,
  historyQuerySchema,
  conversationIdParamSchema,
  truncateConversationSchema,
} from '../schemas/chat.schema';

const router = express.Router();

router.get('/history', validateQuery(historyQuerySchema), chatController.getHistory);
router.get('/conversation/:id', validateParams(conversationIdParamSchema), chatController.getConversation);
router.delete('/conversation/:id', validateParams(conversationIdParamSchema), chatController.deleteConversation);
router.put('/conversation/:id/truncate', validate({ params: conversationIdParamSchema, body: truncateConversationSchema }), chatController.truncateConversation);
router.post('/', validateBody(chatMessageSchema), chatController.chat);
router.post('/onboarding', validateBody(onboardingSchema), chatController.onboarding);
router.post('/bug-trace', validateBody(bugTraceSchema), chatController.bugTrace);
router.post('/commit-story', validateBody(commitStorySchema), chatController.commitStory);
router.post('/pr-review', validateBody(prReviewSchema), chatController.prReview);

// Tech debt route
router.post('/tech-debt', validateBody(chatMessageSchema), chatController.chat);

export default router;

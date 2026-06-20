/**
 * @swagger
 * components:
 *   schemas:
 *     ClaimData:
 *       type: object
 *       required: [claimType, amount, submissionDate]
 *       properties:
 *         claimType:
 *           type: string
 *           enum: [OUTPATIENT, INPATIENT, DENTAL, MATERNITY, OPTICAL]
 *         amount:
 *           type: integer
 *           minimum: 1
 *         submissionDate:
 *           type: string
 *           format: date-time
 *
 *     ProcessClaimResult:
 *       type: object
 *       properties:
 *         requiredDocs:
 *           type: array
 *           items:
 *             type: string
 *         optionalDocs:
 *           type: array
 *           items:
 *             type: string
 *         autoApproved:
 *           type: boolean
 *         approvalTier:
 *           nullable: true
 *           type: object
 *           properties:
 *             approverRole:
 *               type: string
 *             tierOrder:
 *               type: integer
 *         notifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Notification'
 *         slaDueDate:
 *           type: string
 *           format: date-time
 *         customFields:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CustomField'
 */

/**
 * @swagger
 * /tenants/{id}/process-claim:
 *   post:
 *     summary: Process a claim against a tenant's config
 *     tags: [Claims]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClaimData'
 *     responses:
 *       200:
 *         description: Claim processing result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProcessClaimResult'
 *       400:
 *         description: Validation error or claim type not enabled for tenant
 *       404:
 *         description: Tenant not found
 */

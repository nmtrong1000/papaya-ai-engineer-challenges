/**
 * @swagger
 * components:
 *   schemas:
 *     BrandingInput:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *         logoUrl:
 *           type: string
 *           default: ""
 *         primaryColor:
 *           type: string
 *           default: "#000000"
 *         secondaryColor:
 *           type: string
 *           default: "#ffffff"
 *
 *     ClaimTypeConfig:
 *       type: object
 *       required: [type, requiredDocs, optionalDocs, slaDays, escalateTo]
 *       properties:
 *         type:
 *           type: string
 *           enum: [OUTPATIENT, INPATIENT, DENTAL, MATERNITY, OPTICAL]
 *         requiredDocs:
 *           type: array
 *           items:
 *             type: string
 *         optionalDocs:
 *           type: array
 *           items:
 *             type: string
 *         slaDays:
 *           type: integer
 *         escalateTo:
 *           type: string
 *
 *     ApprovalTier:
 *       type: object
 *       required: [minAmount, approverRole, tierOrder]
 *       properties:
 *         minAmount:
 *           type: integer
 *         maxAmount:
 *           type: integer
 *           nullable: true
 *         approverRole:
 *           type: string
 *         tierOrder:
 *           type: integer
 *
 *     Notification:
 *       type: object
 *       required: [event, channels]
 *       properties:
 *         event:
 *           type: string
 *           enum: [claim_submitted, approved, rejected, payment_sent]
 *         channels:
 *           type: array
 *           items:
 *             type: string
 *             enum: [email, sms, webhook]
 *         emailTemplate:
 *           type: string
 *           nullable: true
 *
 *     CustomField:
 *       type: object
 *       required: [name, fieldKey, type, required, options, fieldOrder]
 *       properties:
 *         name:
 *           type: string
 *         fieldKey:
 *           type: string
 *         type:
 *           type: string
 *           enum: [text, number, select]
 *         required:
 *           type: boolean
 *         options:
 *           type: array
 *           items:
 *             type: string
 *         fieldOrder:
 *           type: integer
 *
 *     TenantConfig:
 *       type: object
 *       required: [branding, autoApprovalThreshold, claimTypes, approvalTiers, notifications, customFields]
 *       properties:
 *         branding:
 *           $ref: '#/components/schemas/BrandingInput'
 *         autoApprovalThreshold:
 *           type: integer
 *           minimum: 0
 *         claimTypes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ClaimTypeConfig'
 *         approvalTiers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ApprovalTier'
 *         notifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Notification'
 *         customFields:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CustomField'
 *
 *     TenantSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         slug:
 *           type: string
 *         name:
 *           type: string
 *         primaryColor:
 *           type: string
 *         currentVersionId:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     TenantDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/TenantSummary'
 *         - type: object
 *           properties:
 *             autoApprovalThreshold:
 *               type: integer
 *             branding:
 *               $ref: '#/components/schemas/BrandingInput'
 *             claimTypes:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClaimTypeConfig'
 *             approvalTiers:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ApprovalTier'
 *             notifications:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *             customFields:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomField'
 */

/**
 * @swagger
 * /tenants:
 *   get:
 *     summary: List all tenants
 *     tags: [Tenants]
 *     responses:
 *       200:
 *         description: Array of tenant summaries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TenantSummary'
 *   post:
 *     summary: Create a new tenant
 *     tags: [Tenants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slug, config]
 *             properties:
 *               slug:
 *                 type: string
 *               config:
 *                 $ref: '#/components/schemas/TenantConfig'
 *     responses:
 *       201:
 *         description: Created tenant detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantDetail'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Slug already in use
 */

/**
 * @swagger
 * /tenants/{id}:
 *   get:
 *     summary: Get a tenant by ID
 *     tags: [Tenants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantDetail'
 *       404:
 *         description: Tenant not found
 *   put:
 *     summary: Update a tenant's full config
 *     tags: [Tenants]
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
 *             $ref: '#/components/schemas/TenantConfig'
 *     responses:
 *       200:
 *         description: Updated tenant detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantDetail'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tenant not found
 *   delete:
 *     summary: Delete a tenant
 *     tags: [Tenants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Tenant not found
 */

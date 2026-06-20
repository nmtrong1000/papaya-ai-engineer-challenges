/**
 * @swagger
 * components:
 *   schemas:
 *     VersionSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tenantId:
 *           type: string
 *         version:
 *           type: integer
 *         schemaVersion:
 *           type: integer
 *         note:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /tenants/{id}/versions:
 *   get:
 *     summary: List all versions for a tenant
 *     tags: [Versions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of version summaries, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VersionSummary'
 *       404:
 *         description: Tenant not found
 */

/**
 * @swagger
 * /tenants/{id}/rollback/{version}:
 *   post:
 *     summary: Roll back a tenant to a previous version
 *     tags: [Versions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: version
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 description: Optional label for the rollback version
 *     responses:
 *       200:
 *         description: Updated tenant detail after rollback
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantDetail'
 *       404:
 *         description: Tenant or version not found
 */

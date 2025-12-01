import { query } from '../config/database';
import { UseCase, CreateUseCaseDTO, UpdateUseCaseDTO } from '../models/UseCase';
import { logTrace, logException } from '../utils/appInsights';

export class UseCaseService {
  async getAllUseCases(): Promise<UseCase[]> {
    try {
      logTrace('UseCaseService: Fetching all use cases');
      const result = await query('SELECT * FROM use_cases ORDER BY created_at DESC');
      logTrace(`UseCaseService: Retrieved ${result.rows.length} use cases`);
      return result.rows as UseCase[];
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.getAllUseCases' });
      throw error;
    }
  }

  async getUseCaseById(id: string): Promise<UseCase | null> {
    try {
      logTrace('UseCaseService: Fetching use case by ID');
      const result = await query('SELECT * FROM use_cases WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        logTrace('UseCaseService: Use case not found');
        return null;
      }

      logTrace('UseCaseService: Use case retrieved');
      return result.rows[0] as UseCase;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.getUseCaseById' });
      throw error;
    }
  }

  async createUseCase(useCaseData: CreateUseCaseDTO): Promise<UseCase> {
    try {
      logTrace('UseCaseService: Creating new use case');
      const {
        title,
        short_description,
        full_description,
        department,
        status,
        owner_name,
        owner_email,
        business_impact,
        technology_stack,
        internal_links,
        tags,
        related_use_case_ids,
        application_url,
      } = useCaseData;

      const result = await query(
        `INSERT INTO use_cases (
          title, short_description, full_description, department, status,
          owner_name, owner_email, business_impact, technology_stack,
          internal_links, tags, related_use_case_ids, application_url, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
        RETURNING *`,
        [
          title,
          short_description,
          full_description,
          department,
          status,
          owner_name,
          owner_email,
          business_impact || null,
          JSON.stringify(technology_stack),
          JSON.stringify(internal_links),
          JSON.stringify(tags),
          JSON.stringify(related_use_case_ids || []),
          application_url || null,
        ]
      );

      logTrace('UseCaseService: Use case created successfully');
      return result.rows[0] as UseCase;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.createUseCase' });
      throw error;
    }
  }

  async updateUseCase(id: string, updates: UpdateUseCaseDTO): Promise<UseCase | null> {
    try {
      logTrace('UseCaseService: Updating use case');
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (updates.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.short_description !== undefined) {
      fields.push(`short_description = $${paramIndex++}`);
      values.push(updates.short_description);
    }
    if (updates.full_description !== undefined) {
      fields.push(`full_description = $${paramIndex++}`);
      values.push(updates.full_description);
    }
    if (updates.department !== undefined) {
      fields.push(`department = $${paramIndex++}`);
      values.push(updates.department);
    }
    if (updates.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.owner_name !== undefined) {
      fields.push(`owner_name = $${paramIndex++}`);
      values.push(updates.owner_name);
    }
    if (updates.owner_email !== undefined) {
      fields.push(`owner_email = $${paramIndex++}`);
      values.push(updates.owner_email);
    }
    // image_url is not included since the column does not exist
    if (updates.business_impact !== undefined) {
      fields.push(`business_impact = $${paramIndex++}`);
      values.push(updates.business_impact);
    }
    if (updates.technology_stack !== undefined) {
      fields.push(`technology_stack = $${paramIndex++}`);
      values.push(JSON.stringify(updates.technology_stack));
    }
    if (updates.internal_links !== undefined) {
      fields.push(`internal_links = $${paramIndex++}`);
      values.push(JSON.stringify(updates.internal_links));
    }
    if (updates.tags !== undefined) {
      fields.push(`tags = $${paramIndex++}`);
      values.push(JSON.stringify(updates.tags));
    }
    if (updates.related_use_case_ids !== undefined) {
      fields.push(`related_use_case_ids = $${paramIndex++}`);
      values.push(JSON.stringify(updates.related_use_case_ids));
    }
    if (updates.application_url !== undefined) {
      fields.push(`application_url = $${paramIndex++}`);
      values.push(updates.application_url);
    }

    if (fields.length === 0) {
      const result = await query('SELECT * FROM use_cases WHERE id = $1', [id]);
      return result.rows[0] as UseCase || null;
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE use_cases SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rowCount === 0) {
      logTrace('UseCaseService: Use case not found for update');
      return null;
    }

    logTrace('UseCaseService: Use case updated successfully');
    return result.rows[0] as UseCase;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.updateUseCase' });
      throw error;
    }
  }

  async deleteUseCase(id: string): Promise<boolean> {
    try {
      logTrace('UseCaseService: Deleting use case');
      const result = await query('DELETE FROM use_cases WHERE id = $1', [id]);
      const success = result.rowCount !== null && result.rowCount > 0;
      logTrace(`UseCaseService: Use case deletion ${success ? 'successful' : 'failed'}`);
      return success;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.deleteUseCase' });
      throw error;
    }
  }
}

export const useCaseService = new UseCaseService();

import { X } from 'lucide-react';
import { UseCase, UpdateUseCaseDTO } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { constants } from '../config';
import { useState } from 'react';
import { useCaseApi } from '../services/api';

interface UseCaseDetailModalProps {
  useCase: UseCase;
  onClose: () => void;
  relatedUseCases: UseCase[];
  onRelatedClick: (id: string) => void;
  onUpdate?: () => void;
}

const stages = ['Ideation', 'Pre-Evaluation', 'Evaluation', 'PoC', 'MVP', 'Live', 'Archived'];

export default function UseCaseDetailModal({
  useCase,
  onClose,
  relatedUseCases,
  onRelatedClick,
  onUpdate
}: UseCaseDetailModalProps) {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateUseCaseDTO>({
    title: useCase.title,
    short_description: useCase.short_description,
    full_description: useCase.full_description,
    department: useCase.department,
    status: useCase.status,
    owner_name: useCase.owner_name,
    owner_email: useCase.owner_email,
    technology_stack: useCase.technology_stack,
    business_impact: useCase.business_impact,
    application_url: useCase.application_url,
    internal_links: useCase.internal_links,
    image_url: useCase.image_url
  });
  const [error, setError] = useState<string | null>(null);

  const imageUrl = useCase.image_url || constants.defaultImages[useCase.department as keyof typeof constants.defaultImages];
  const statusColor = constants.statusColors[useCase.status as keyof typeof constants.statusColors] || 'bg-gray-500';
  const currentStageIndex = stages.indexOf(useCase.status);

  const handleInputChange = (field: keyof UpdateUseCaseDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await useCaseApi.updateUseCase(useCase.id, formData);
      setIsEditMode(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update use case');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          <div className="relative h-[200px] w-full overflow-hidden rounded-t-lg">
            <img
              src={imageUrl}
              alt={useCase.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-4xl font-bold">
                {t(`department.${useCase.department}`)}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          <div className="mb-6">
            {isEditMode ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-3xl font-bold text-gray-900 mb-2 w-full border-b-2 border-gray-300 focus:border-[#E30613] outline-none"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {useCase.title}
              </h1>
            )}
            <div className="flex items-center gap-3">
              {isEditMode ? (
                <>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="px-3 py-1 rounded-full text-sm font-medium border-2 border-gray-300 focus:border-[#E30613] outline-none"
                  >
                    {stages.map(stage => (
                      <option key={stage} value={stage}>{t(`status.${stage}`)}</option>
                    ))}
                  </select>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="px-3 py-1 rounded-md text-sm font-medium border-2 border-gray-300 focus:border-[#E30613] outline-none"
                  >
                    {Object.keys(constants.defaultImages).map(dept => (
                      <option key={dept} value={dept}>{t(`department.${dept}`)}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <span
                    className={`${statusColor} text-white px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {t(`status.${useCase.status}`)}
                  </span>
                  <span className="text-gray-600 font-medium">{t(`department.${useCase.department}`)}</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t('modal.description')}</h2>
              {isEditMode ? (
                <textarea
                  value={formData.full_description}
                  onChange={(e) => handleInputChange('full_description', e.target.value)}
                  rows={6}
                  className="w-full text-gray-700 leading-relaxed p-3 border-2 border-gray-300 rounded-lg focus:border-[#E30613] outline-none"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {useCase.full_description}
                </p>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t('modal.ownerDetails')}</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                {isEditMode ? (
                  <>
                    <input
                      type="text"
                      value={formData.owner_name}
                      onChange={(e) => handleInputChange('owner_name', e.target.value)}
                      placeholder="Owner Name"
                      className="w-full text-gray-900 font-medium mb-2 p-2 border border-gray-300 rounded focus:border-[#E30613] outline-none"
                    />
                    <input
                      type="email"
                      value={formData.owner_email}
                      onChange={(e) => handleInputChange('owner_email', e.target.value)}
                      placeholder="Owner Email"
                      className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:border-[#E30613] outline-none"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-gray-900 font-medium">{useCase.owner_name}</p>
                    <p className="text-gray-600">{t(`department.${useCase.department}`)}</p>
                    <a
                      href={`mailto:${useCase.owner_email}`}
                      className="text-[#E30613] hover:underline"
                    >
                      {useCase.owner_email}
                    </a>
                  </>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t('modal.useCaseStage')}</h2>
              <div className="relative">
                <div className="flex justify-between mb-2">
                  {stages.map((stage, index) => (
                    <div
                      key={stage}
                      className={`flex-1 text-center ${
                        index <= currentStageIndex
                          ? 'text-[#E30613] font-medium'
                          : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                          index <= currentStageIndex ? 'bg-[#E30613]' : 'bg-gray-300'
                        }`}
                      />
                      <span className="text-xs hidden sm:inline">{t(`status.${stage}`)}</span>
                    </div>
                  ))}
                </div>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E30613] transition-all duration-500"
                    style={{
                      width: `${((currentStageIndex + 1) / stages.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            </section>

            {(useCase.business_impact || isEditMode) && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{t('modal.businessImpact')}</h2>
                {isEditMode ? (
                  <textarea
                    value={formData.business_impact || ''}
                    onChange={(e) => handleInputChange('business_impact', e.target.value)}
                    rows={3}
                    className="w-full text-gray-700 p-3 border-2 border-gray-300 rounded-lg focus:border-[#E30613] outline-none"
                  />
                ) : (
                  <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    {useCase.business_impact}
                  </p>
                )}
              </section>
            )}

            {useCase.technology_stack.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{t('modal.technologyStack')}</h2>
                <div className="flex flex-wrap gap-2">
                  {useCase.technology_stack.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-900 text-white px-3 py-1 rounded-md text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {Object.keys(useCase.internal_links).length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{t('modal.internalLinks')}</h2>
                <div className="space-y-2">
                  {useCase.internal_links.sharepoint && (
                    <a
                      href={useCase.internal_links.sharepoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#E30613] hover:underline"
                    >
                      {t('modal.sharepoint')}
                    </a>
                  )}
                  {useCase.internal_links.confluence && (
                    <a
                      href={useCase.internal_links.confluence}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#E30613] hover:underline"
                    >
                      {t('modal.confluence')}
                    </a>
                  )}
                  {useCase.internal_links.demo && (
                    <a
                      href={useCase.internal_links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#E30613] hover:underline"
                    >
                      {t('modal.demo')}
                    </a>
                  )}
                </div>
              </section>
            )}

            {useCase.internal_links.bits && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{t('modal.rolesResponsibilities')}</h2>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <a
                    href={useCase.internal_links.bits}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#E30613] hover:underline font-medium"
                  >
                    {t('modal.requestRoles')}
                  </a>
                </div>
              </section>
            )}

            {relatedUseCases.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">{t('modal.relatedUseCases')}</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {relatedUseCases.map((related) => (
                    <div
                      key={related.id}
                      onClick={() => onRelatedClick(related.id)}
                      className="flex-shrink-0 w-64 bg-gray-50 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow duration-200"
                    >
                      <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {related.short_description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4">
          {isEditMode ? (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setFormData({
                    title: useCase.title,
                    short_description: useCase.short_description,
                    full_description: useCase.full_description,
                    department: useCase.department,
                    status: useCase.status,
                    owner_name: useCase.owner_name,
                    owner_email: useCase.owner_email,
                    technology_stack: useCase.technology_stack,
                    business_impact: useCase.business_impact,
                    application_url: useCase.application_url,
                    internal_links: useCase.internal_links,
                    image_url: useCase.image_url
                  });
                  setError(null);
                }}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-lg font-medium bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-lg font-medium bg-[#E30613] text-white hover:bg-[#c00510] transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (useCase.application_url) {
                    window.open(useCase.application_url, '_blank');
                  }
                }}
                disabled={!useCase.application_url}
                className={`flex-[2] px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  useCase.application_url
                    ? 'bg-[#E30613] text-white hover:bg-[#c00510]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('modal.launchApplication')}
              </button>
              {isAdmin() && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex-1 px-6 py-3 rounded-lg font-medium bg-[#E30613] text-white hover:bg-[#c00510] transition-colors duration-200"
                >
                  Update
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

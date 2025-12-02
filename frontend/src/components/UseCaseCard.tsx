import { UseCase } from '../types';
import { constants } from '../config';
import { UI_CONSTANTS, ROLE_ATTRIBUTES, TAB_INDEX, KEYBOARD_KEYS } from '../config/constants';

interface UseCaseCardProps {
  useCase: UseCase;
  onClick: () => void;
}

export default function UseCaseCard({ useCase, onClick }: UseCaseCardProps) {
  const departmentImage = constants.defaultImages[useCase.department as keyof typeof constants.defaultImages];
  const statusColor = constants.statusColors[useCase.status as keyof typeof constants.statusColors] || 'bg-gray-500';
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.03]"
      role={ROLE_ATTRIBUTES.BUTTON}
      tabIndex={TAB_INDEX.FOCUSABLE}
      onKeyDown={(e) => {
        if (e.key === KEYBOARD_KEYS.ENTER || e.key === KEYBOARD_KEYS.SPACE) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative h-[180px] w-full overflow-hidden">
        <img
          src={departmentImage}
          alt={useCase.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute top-4 left-4">
          <span
            className={`${statusColor} text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm bg-opacity-90`}
          >
            {useCase.status}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-lg font-bold tracking-wide">
            {useCase.department}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
          {useCase.title}
        </h3>
        <p className="text-gray-600 text-base mb-3 line-clamp-3">
          {useCase.short_description}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {useCase.tags.slice(0, UI_CONSTANTS.SLICE_LIMITS.MAX_TAGS_DISPLAY).map((tag, index) => (
            <span
              key={index}
              className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
            >
              {UI_CONSTANTS.TEXT.TAG_PREFIX}{tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-400">
          {UI_CONSTANTS.TEXT.BY_PREFIX} {useCase.owner_name} {UI_CONSTANTS.TEXT.DEPARTMENT_SEPARATOR} {useCase.department}
        </p>
      </div>
    </div>
  );
}

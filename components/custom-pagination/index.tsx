import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
interface ComponentProps {
  currentPage: number;
  lastPage: number;
  onPageChanged?: (newPage: number) => void;
}

const CustomPagination = (props: ComponentProps) => {
  const { currentPage, lastPage, onPageChanged } = props;

  const onPressPageHandler = (page: number) => {
    onPageChanged?.(page);
  };

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPressPageHandler(currentPage - 1)}
            />
          </PaginationItem>
        )}

        {currentPage >= 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* 1 */}
        {currentPage >= 3 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPressPageHandler(currentPage - 2)}>
              {currentPage - 2}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 2 */}
        {currentPage >= 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPressPageHandler(currentPage - 1)}>
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 3 - active */}
        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>

        {/* 4 */}
        {lastPage - currentPage >= 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPressPageHandler(currentPage + 1)}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* 5 */}
        {lastPage - currentPage >= 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPressPageHandler(currentPage + 2)}>
              {currentPage + 2}
            </PaginationLink>
          </PaginationItem>
        )}

        {lastPage - currentPage >= 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {currentPage < lastPage && (
          <PaginationItem>
            <PaginationNext
              onClick={() => onPressPageHandler(currentPage + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;

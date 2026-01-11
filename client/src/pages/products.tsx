import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ProductCard } from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

const filters = {
  category: ["Silk", "Cotton", "Chiffon", "Georgette", "Designer"],
  fabric: ["Pure Silk", "Cotton Silk", "Banarasi", "Kanjeevaram", "Chanderi"],
  occasion: ["Wedding", "Party", "Casual", "Festive", "Office"],
  color: ["Red", "Blue", "Green", "Gold", "Pink", "Black", "White"],
  price: [
    { label: "Under ₹2,000", value: "0-2000" },
    { label: "₹2,000 - ₹5,000", value: "2000-5000" },
    { label: "₹5,000 - ₹10,000", value: "5000-10000" },
    { label: "Above ₹10,000", value: "10000+" },
  ],
};

interface FilterSectionProps {
  title: string;
  items: string[] | { label: string; value: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}

function FilterSection({ title, items, selected, onToggle }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border pb-4">
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
        <span className="font-medium text-foreground" data-testid={`text-filter-${title.toLowerCase()}`}>{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 space-y-2">
        {items.map((item) => {
          const value = typeof item === "string" ? item : item.value;
          const label = typeof item === "string" ? item : item.label;
          return (
            <label
              key={value}
              className="flex items-center gap-3 cursor-pointer group"
              data-testid={`filter-${title.toLowerCase()}-${value.toLowerCase()}`}
            >
              <Checkbox
                checked={selected.includes(value)}
                onCheckedChange={() => onToggle(value)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {label}
              </span>
            </label>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

function FilterSidebar({
  selectedFilters,
  onToggleFilter,
  onClearFilters,
}: {
  selectedFilters: Record<string, string[]>;
  onToggleFilter: (category: string, value: string) => void;
  onClearFilters: () => void;
}) {
  const hasFilters = Object.values(selectedFilters).some((arr) => arr.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground" data-testid="text-filters-title">Filters</h2>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} data-testid="button-clear-filters">
            Clear All
          </Button>
        )}
      </div>
      <FilterSection
        title="Category"
        items={filters.category}
        selected={selectedFilters.category || []}
        onToggle={(value) => onToggleFilter("category", value)}
      />
      <FilterSection
        title="Fabric"
        items={filters.fabric}
        selected={selectedFilters.fabric || []}
        onToggle={(value) => onToggleFilter("fabric", value)}
      />
      <FilterSection
        title="Occasion"
        items={filters.occasion}
        selected={selectedFilters.occasion || []}
        onToggle={(value) => onToggleFilter("occasion", value)}
      />
      <FilterSection
        title="Color"
        items={filters.color}
        selected={selectedFilters.color || []}
        onToggle={(value) => onToggleFilter("color", value)}
      />
      <FilterSection
        title="Price"
        items={filters.price}
        selected={selectedFilters.price || []}
        onToggle={(value) => onToggleFilter("price", value)}
      />
    </div>
  );
}

function parseFiltersFromSearch(searchString: string): Record<string, string[]> {
  const params = new URLSearchParams(searchString);
  const category = params.get("category");
  const occasion = params.get("occasion");
  
  const initialFilters: Record<string, string[]> = {};
  if (category) {
    const categoryMatch = filters.category.find(c => c.toLowerCase() === category.toLowerCase());
    if (categoryMatch) {
      initialFilters.category = [categoryMatch];
    }
  }
  if (occasion) {
    const occasionMatch = filters.occasion.find(o => o.toLowerCase() === occasion.toLowerCase());
    if (occasionMatch) {
      initialFilters.occasion = [occasionMatch];
    }
  }
  return initialFilters;
}

export default function Products() {
  const [location] = useLocation();
  const searchString = useSearch();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Initialize filters from URL params - computed synchronously
  const initialFilters = useMemo(() => parseFiltersFromSearch(searchString), [searchString]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(initialFilters);

  // Update filters when URL changes
  useEffect(() => {
    const newFilters = parseFiltersFromSearch(searchString);
    setSelectedFilters(newFilters);
  }, [searchString]);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter((v) => v !== value) };
      }
      return { ...prev, [category]: [...current, value] };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({});
  };

  // Filter products based on selected filters
  const filteredProducts = products?.filter((product) => {
    const matchCategory =
      !selectedFilters.category?.length ||
      selectedFilters.category.some((c) => product.category.toLowerCase().includes(c.toLowerCase()));
    const matchFabric =
      !selectedFilters.fabric?.length ||
      selectedFilters.fabric.some((f) => product.fabric.toLowerCase().includes(f.toLowerCase()));
    const matchOccasion =
      !selectedFilters.occasion?.length ||
      selectedFilters.occasion.some((o) => product.occasion.toLowerCase().includes(o.toLowerCase()));
    const matchColor =
      !selectedFilters.color?.length ||
      selectedFilters.color.some((c) => product.color.toLowerCase().includes(c.toLowerCase()));

    return matchCategory && matchFabric && matchOccasion && matchColor;
  });

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-card border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground" data-testid="text-products-title">
            Our Collection
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover our exquisite range of handcrafted sarees
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              selectedFilters={selectedFilters}
              onToggleFilter={toggleFilter}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Bar */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              <span className="text-sm text-muted-foreground" data-testid="text-product-count">
                {filteredProducts?.length || 0} products
              </span>
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="button-mobile-filters">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <FilterSidebar
                    selectedFilters={selectedFilters}
                    onToggleFilter={toggleFilter}
                    onClearFilters={clearFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {Object.entries(selectedFilters).some(([_, values]) => values.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(selectedFilters).map(([category, values]) =>
                  values.map((value) => (
                    <Button
                      key={`${category}-${value}`}
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleFilter(category, value)}
                      data-testid={`button-remove-filter-${value.toLowerCase()}`}
                    >
                      {value}
                      <X className="h-3 w-3 ml-2" />
                    </Button>
                  ))
                )}
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="aspect-[4/5] rounded-md" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  ))
                : filteredProducts?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>

            {/* Empty State */}
            {!isLoading && filteredProducts?.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground" data-testid="text-no-products">
                  No products found matching your filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                  data-testid="button-clear-filters-empty"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

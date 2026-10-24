import React from 'react';
import { Package, Sparkles, Check, Plus, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../../data/barbershop.data';
import { ProductItem } from '../../types';

interface ProductsSectionProps {
  onReserveProduct: (product: ProductItem) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onReserveProduct }) => {
  return (
    <section id="products-section" className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-surface-light dark:bg-[#070611] border-b border-[#6A6A70]/15 dark:border-[#9448AC]/20">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-[#6A6A70]/15 dark:border-white/10 pb-4">
          <div className="space-y-1">
            <div id="products-header-badge" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9448AC]">
              <span className="w-2 h-2 rounded-full bg-[#9448AC]" />
              <span id="products-header-badge-text">LINHA EXCLUSIVA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#000020] dark:text-white font-display">
              Produtos
            </h2>
            <p className="text-xs sm:text-sm text-[#45454C] dark:text-slate-400 max-w-xl">
              Linha profissional Piratas For Men para cuidados diários em casa. Disponíveis na unidade.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#480355] dark:text-[#B66BD0] bg-[#9448AC]/10 px-3 py-1.5 rounded-full border border-[#9448AC]/20 self-start md:self-auto">
            <ShoppingBag className="w-3.5 h-3.5 text-[#9448AC]" />
            <span>6 itens na unidade</span>
          </div>
        </div>

        {/* Products Grid - 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-6">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#101026] border border-[#6A6A70]/15 dark:border-white/10 hover:border-[#9448AC]/50 transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                {/* Product Photo Showcase */}
                <div className="h-32 sm:h-44 w-full rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/5 p-2 sm:p-3 flex items-center justify-center overflow-hidden border border-slate-200/60 dark:border-white/5 group-hover:border-[#9448AC]/40 transition-colors">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-[#9448AC]/40" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#9448AC] font-mono block truncate">
                    {product.brand} • {product.category}
                  </span>
                  <h3 className="text-xs sm:text-base font-bold text-[#000020] dark:text-white group-hover:text-[#9448AC] transition-colors leading-snug line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#45454C] dark:text-slate-300 leading-snug line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-[#6A6A70]/10 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[8px] sm:text-[9px] text-slate-400 block font-mono">Valor</span>
                  <span className="text-sm sm:text-base font-extrabold text-[#480355] dark:text-[#B66BD0] font-display">
                    R$ {product.suggestedPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onReserveProduct(product)}
                  className="w-full sm:w-auto min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#9448AC] text-[#000020] hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-[#9448AC] text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Reservar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

import type { APIRoute } from 'astro';
import siteConfig from '../config/site.json';

export const GET: APIRoute = () => {
  const content = `# ${siteConfig.siteName}

> ${siteConfig.defaultDescription}

${siteConfig.siteName} proporciona herramientas financieras y de facturación gratuitas para particulares, autónomos, pymes y asesores fiscales en España, México y Latinoamérica.

## Calculadoras Principales

- [Calculadora de IVA](${siteConfig.siteUrl}/): Calculadora general de IVA con tipos oficiales de España 2025 (21%, 10%, 4%) y porcentajes personalizados.
- [IVA de una Cantidad](${siteConfig.siteUrl}/iva-de-una-cantidad/): Calcula la cuota de IVA, base imponible y precio final a partir de cualquier importe.
- [IVA Incluido](${siteConfig.siteUrl}/iva-incluido/): Quita o desglosa el IVA de un precio bruto para extraer la base imponible y la cuota exacta.
- [IVA Porcentaje](${siteConfig.siteUrl}/iva-porcentaje/): Descubre y calcula qué porcentaje o tasa de IVA se aplicó a partir de la base y el total.
- [IVA Factura](${siteConfig.siteUrl}/iva-factura/): Generador de desglose de facturas con múltiples líneas de productos, precios unitarios y diferentes tipos de IVA.
- [IVA a Pagar](${siteConfig.siteUrl}/iva-a-pagar/): Liquidación trimestral de IVA (Modelo 303), restando el IVA soportado del IVA repercutido.
- [IVA e IRPF](${siteConfig.siteUrl}/iva-irpf/): Cálculo simultáneo de IVA y retención del IRPF para facturas de profesionales autónomos en España.
- [Retención IVA](${siteConfig.siteUrl}/retencion-iva/): Calculadora de retenciones fiscales de IVA (75%, 50% o personalizado) para operaciones con Hacienda.
- [IVA e ISR](${siteConfig.siteUrl}/iva-isr/): Cálculo simultáneo de IVA al 16% y retención de ISR para recibos de honorarios y CFDI en México.
- [IVA RESICO](${siteConfig.siteUrl}/iva-resico/): Cálculo de impuestos mensuales bajo el Régimen Simplificado de Confianza en México (SAT).
- [IVA e IEPS](${siteConfig.siteUrl}/iva-ieps/): Cálculo de Impuesto Especial sobre Producción y Servicios más IVA para México.
- [IVA Acreditable](${siteConfig.siteUrl}/iva-acreditable/): Cálculo de IVA deducible/acreditable para declaraciones mensuales de personas físicas y morales.
- [IVA Honorarios](${siteConfig.siteUrl}/iva-honorarios/): Cálculo de IVA y retenciones en facturas de honorarios profesionales.
- [Recargo de Equivalencia](${siteConfig.siteUrl}/iva-recargo-equivalencia/): Cálculo de IVA con recargo de equivalencia (5,2%, 1,4% y 0,5%) para comerciantes minoristas.

## Blog y Guías Fiscales

- [Cómo calcular el IVA fácilmente con una calculadora de IVA](${siteConfig.siteUrl}/blog/como-calcular-el-iva-facilmente-con-una-calculadora-de-iva/): Guía práctica para calcular el IVA desde cero, base imponible, desglose del impuesto y ejemplos claros.
- [Cómo calcular el IVA incluido en un precio y conocer la base imponible](${siteConfig.siteUrl}/blog/como-calcular-el-iva-incluido-en-un-precio-y-conocer-la-base-imponible/): Guía completa para desglosar el IVA incluido, calcular la base imponible con fórmula inversa y evitar errores contables.

## Enlaces Informativos

- [Sobre Nosotros](${siteConfig.siteUrl}/about-us/): Información sobre el proyecto y equipo de Calculadora IVA.
- [Contacto](${siteConfig.siteUrl}/contact-us/): Formulario de soporte y consultas.
- [Política de Privacidad](${siteConfig.siteUrl}/privacy/): Información de privacidad y RGPD.
- [Términos y Condiciones](${siteConfig.siteUrl}/terms/): Términos legales de uso del servicio.
- [Mapa del Sitio](${siteConfig.siteUrl}/sitemap/): Índice estructurado de páginas del sitio web.
- [Sitemap XML](${siteConfig.siteUrl}/sitemap.xml): Archivo XML de sitemap con todas las rutas y prioridades.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};

import { ModuleWithProviders, NgModule } from "@angular/core";
import { MathDirective } from "./mathjax.directive";
import { MathServiceImpl } from "./mathjax.service";

@NgModule({
  declarations: [MathDirective],
  exports: [MathDirective]
})
export class MathModule {
  constructor(mathService: MathServiceImpl) {
    // see https://docs.mathjax.org/en/latest/advanced/dynamic.html
    const script = document.createElement('script') as HTMLScriptElement;
    script.type = 'text/javascript';
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.0.1/es5/tex-mml-chtml.js';

    // script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js';
/*     script.async = true;

    document.getElementsByTagName('head')[0].appendChild(script);

    const config = document.createElement('script') as HTMLScriptElement;
    config.type = 'text/x-mathjax-config'; */
    // register notifier to StartupHook and trigger .next() for all subscribers
    /* config.text = `
      MathJax.Hub.Config({
          extensions: ["tex2jax.js", "TeX/AMSmath.js"],
          jax: ["input/TeX", "output/SVG"],
          skipStartupTypeset: true,
          tex2jax: { inlineMath: [["$", "$"]],displayMath:[["$$", "$$"]] }
        });
        MathJax.Hub.Register.StartupHook('End', () => {
          window.hubReady.next();
          window.hubReady.complete();
        });
      `; */

 /*    document.getElementsByTagName('head')[0].appendChild(config); */
  }

  // this is needed so service constructor which will bind
  // notifier to window object before module constructor is called
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: MathModule,
      providers: [{ provide: MathServiceImpl, useClass: MathServiceImpl }]
    };
  }
}
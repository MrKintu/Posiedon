import * as React from "react";
import styles from './MyComponent.module.css';
import Counter from "../../components/Counter/Counter";
import { useRouter } from 'next/router';

export default function MyComponent() {
    const router = useRouter();
    const {thing} = router.query;

  return (
    <>
      <div className={styles.div} maxWidth={1200} lazyLoad={false}>
        <section className={styles.section}>
          <div className={styles.visuallyBuildAnyApp}>
            <div className={styles.div2}>
              <img
                loading="lazy"
                sizes="(max-width: 638px) 8vw, (max-width: 998px) 6vw, 4vw"
                src="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F7bca7936d0a54d568dc5da34f4aaa5af?width=50"
                className={styles.img}
              />
              <div className={styles.div3}>
                <p>+</p>
              </div>
              <img
                loading="lazy"
                sizes="(max-width: 638px) 7vw, (max-width: 998px) 4vw, 3vw"
                src="https://cdn.builder.io/api/v1/image/assets%2F8d9ee72a33344b4b867918b442ebd0af%2F674df6ccd3c94f29bf67d9a8e5b00e08?width=39"
                className={styles.img2}
              />
            </div>
            <div className={styles.div4}>
              <p>Visually build any app with Next.js and Builder.io</p>
              <p>This is the var: {thing}</p>
            </div>
          </div>
          <div className={styles.makeYourFirstEdit}>
            <div className={styles.div5}>
              <div className={styles.div6}>
                <p>Compose with your components</p>
              </div>
              <div className={styles.div7}>
                <p>
                  This is a custom component written in Next and registered with
                  Builder. You can register any code components for
                  drag-and-drop editing.
                </p>
              </div>
              <img
                loading="lazy"
                sizes="(max-width: 998px) 11vw, 8vw"
                src="https://cdn.builder.io/api/v1/image/assets%2F8d9ee72a33344b4b867918b442ebd0af%2Fdd6e201535a748229aa374f04e14eaea"
                className={styles.img3}
              />
            </div>
            <Counter className={styles.counter} initialValue={99} initialCount={50} />
          </div>
          <div className={styles.startHere}>
            <a
              href="https://www.builder.io/c/docs/integrating-builder-pages#creating-a-builder-page"
              target="_blank"
              className={styles.a}
            >
              <div className={styles.div8}>
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F238f66e07d3049eaa5d93b56b86c6579?&width=100 100w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F238f66e07d3049eaa5d93b56b86c6579?&width=200 200w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F238f66e07d3049eaa5d93b56b86c6579?&width=400 400w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F238f66e07d3049eaa5d93b56b86c6579?&width=800 800w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F238f66e07d3049eaa5d93b56b86c6579?&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F238f66e07d3049eaa5d93b56b86c6579?&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F238f66e07d3049eaa5d93b56b86c6579?&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F238f66e07d3049eaa5d93b56b86c6579?"
                  className={styles.img4}
                />
                <div className={styles.div9}>
                  <p>Create Builder pages in your app</p>
                </div>
                <div className={styles.div10}>
                  <p>
                    This is an example page created in Builder. Start here to
                    review how your integration works and create new pages in
                    your app.
                  </p>
                </div>
              </div>
            </a>
            <a
              href="https://www.builder.io/c/docs/custom-components-intro"
              target="_blank"
              className={styles.a2}
            >
              <div className={styles.div11}>
                <div className={styles.div12}>
                  <img
                    loading="lazy"
                    srcSet="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F5a4c2bdfff2049c09a9b7dbcc036a263?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F5a4c2bdfff2049c09a9b7dbcc036a263?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F5a4c2bdfff2049c09a9b7dbcc036a263?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F5a4c2bdfff2049c09a9b7dbcc036a263?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F5a4c2bdfff2049c09a9b7dbcc036a263?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F5a4c2bdfff2049c09a9b7dbcc036a263?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F5a4c2bdfff2049c09a9b7dbcc036a263?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F5a4c2bdfff2049c09a9b7dbcc036a263"
                    className={styles.img5}
                  />
                </div>
                <div className={styles.div13}>
                  <p>Register your Next components </p>
                </div>
                <div className={styles.div14}>
                  <p>
                    Register your Next.js components in Builder. You can drag
                    and drop any custom component from the Visual Editor onto a
                    page.
                  </p>
                </div>
              </div>
            </a>
            <a
              href="https://www.builder.io/c/blueprints"
              target="_blank"
              className={styles.a3}
            >
              <div className={styles.div15}>
                <div className={styles.div16}>
                  <img
                    loading="lazy"
                    srcSet="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F74cceb58eae948e4b1edcc930a7c23b9?format=webp&width=100 100w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F74cceb58eae948e4b1edcc930a7c23b9?format=webp&width=200 200w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F74cceb58eae948e4b1edcc930a7c23b9?format=webp&width=400 400w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F74cceb58eae948e4b1edcc930a7c23b9?format=webp&width=800 800w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F74cceb58eae948e4b1edcc930a7c23b9?format=webp&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F74cceb58eae948e4b1edcc930a7c23b9?format=webp&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F74cceb58eae948e4b1edcc930a7c23b9?format=webp&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F74cceb58eae948e4b1edcc930a7c23b9?format=webp&width=2000"
                    className={styles.img6}
                  />
                </div>
                <div className={styles.div17}>
                  <p>Integrate common use cases</p>
                </div>
                <div className={styles.div18}>
                  <p>
                    Reference how you can use Builder for your blog, eCommerce
                    product listings, or for your entire site.
                  </p>
                </div>
              </div>
            </a>
            <a
              href="https://www.builder.io/c/docs/ui-ve-tour"
              target="_blank"
              className={styles.a4}
            >
              <div className={styles.div19}>
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F8195e5670c27459fb5231c7e24d6de58?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F8195e5670c27459fb5231c7e24d6de58?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F8195e5670c27459fb5231c7e24d6de58?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F8195e5670c27459fb5231c7e24d6de58?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F8195e5670c27459fb5231c7e24d6de58?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F8195e5670c27459fb5231c7e24d6de58?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F8195e5670c27459fb5231c7e24d6de58?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F8195e5670c27459fb5231c7e24d6de58"
                  className={styles.img7}
                />
                <div className={styles.div20}>
                  <p>Tour the Visual Editor </p>
                </div>
                <div className={styles.div21}>
                  <p>
                    Check out the UI of the Visual Editor and compose complex
                    layouts without writing any code.
                  </p>
                </div>
              </div>
            </a>
            <a
              href="https://www.builder.io/c/docs/block-types"
              target="_blank"
              className={styles.a5}
            >
              <div className={styles.div22}>
                <img
                  loading="lazy"
                  srcSet="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fcda9ac8a8433413b9d9c3606812cabc9?width=100 100w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fcda9ac8a8433413b9d9c3606812cabc9?width=200 200w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fcda9ac8a8433413b9d9c3606812cabc9?width=400 400w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fcda9ac8a8433413b9d9c3606812cabc9?width=800 800w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fcda9ac8a8433413b9d9c3606812cabc9?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fcda9ac8a8433413b9d9c3606812cabc9?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fcda9ac8a8433413b9d9c3606812cabc9?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fcda9ac8a8433413b9d9c3606812cabc9"
                  className={styles.img8}
                />
                <div className={styles.div23}>
                  <p>Learn the building blocks</p>
                </div>
                <div className={styles.div24}>
                  <p>
                    Creating content in Builder uses a flexible toolset of
                    no-code blocks that you can use to create almost anything.
                  </p>
                </div>
              </div>
            </a>
          </div>
        </section>
      </div>
      <div
        className={styles.builderFooterLearnMore}
        maxWidth={1200}
        lazyLoad={false}
      >
        <section className={styles.builderFooterSection2}>
          <div className={styles.div25}>
            <div className={styles.div26}>
              <div className={styles.column}>
                <div className={styles.integrateBuilderWithYourApp}>
                  <div className={styles.div27}>
                    <div className={styles.div28}>
                      <p>Integrating Builder with your app</p>
                    </div>
                    <div className={styles.div29}>
                      <a
                        href="https://www.builder.io/c/docs/how-builder-works-technical"
                        target="_blank"
                        className={styles.integrations}
                      >
                        <p>How Builder Works</p>
                      </a>
                      <a
                        href="https://www.builder.io/c/docs/integrate-symbols"
                        target="_blank"
                        className={styles.a6}
                      >
                        <p>Integrate Symbols</p>
                      </a>
                      <a
                        href="https://www.builder.io/c/docs/integrate-cms-data"
                        target="_blank"
                        className={styles.guides}
                      >
                        <p>Using Builder CMS data</p>
                      </a>
                      <a
                        href="https://www.builder.io/c/docs/api-intro"
                        target="_blank"
                        className={styles.a7}
                      >
                        <p>Builder API </p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.column2}>
                <div className={styles.learnTheBuilderVisualEditor}>
                  <div className={styles.div30}>
                    <p>Learn the Builder Visual Editor</p>
                  </div>
                  <div className={styles.div31}>
                    <a
                      href="https://www.builder.io/c/docs/how-builder-works"
                      target="_blank"
                      className={styles.a8}
                    >
                      <p>Builder Docs</p>
                    </a>
                    <a
                      href="https://www.builder.io/c/docs/custom-components-intro"
                      target="_blank"
                      className={styles.a9}
                    >
                      <p>Custom Components</p>
                    </a>
                    <a
                      href="https://www.builder.io/c/blueprints"
                      target="_blank"
                      className={styles.a10}
                    >
                      <p>Blueprints</p>
                    </a>
                    <a
                      href="https://forum.builder.io/"
                      target="_blank"
                      className={styles.a11}
                    >
                      <p>Forum</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
    </>
  );
}
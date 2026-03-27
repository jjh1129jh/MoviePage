export default function Footer() {
    return (
        <footer className="h-45 md:h-34 flex flex-col">
            <div className="w-full h-full md:h-[60%] flex flex-col md:flex-row md:gap-2 pb-5 md:pb-3 md:pr-3 items-center md:items-end justify-center bg-gray-800 md:bg-[#1d1d1d] relative">
                <img className="w-8 mt-3 mb-2 md:mt-0" src="/img/logo.png" alt="logo" />
                <div className="text-center md:text-left">
                    <h3 className="opacity-80 text-[16px] md:text-[21px] md:leading-[1.1]">MOVIE PAGE</h3>
                    <p className="opacity-80 text-[12px]">From. JIHWAN JEONG</p>
                </div>
            </div>
            <div className="w-full h-[40%] bg-gray-900 md:bg-[#1d1d1d] md:flex md:items-center md:justify-center">
                <div className="w-full h-full flex items-center md:items-start justify-end md:justify-center gap-3 md:gap-5 pr-3 md:pr-0">
                    <div className="flex items-center">
                        <img className="w-5" src="/img/svg_html.svg" alt="html" />
                        <span className="hidden">Html</span>
                    </div>
                    <div className="flex items-center">
                        <img className="w-5" src="/img/svg_css.svg" alt="Css" />
                        <span className="hidden">Css</span>
                    </div>
                    <div className="flex items-center">
                        <img className="w-5" src="/img/svg_tailwind.svg" alt="Tailwind" />
                        <span className="hidden">Tailwind</span>
                    </div>
                    <div className="flex items-center">
                        <img className="w-5" src="/img/svg_js.svg" alt="Js" />
                        <span className="hidden">Js</span>
                    </div>
                    <div className="flex items-center">
                        <img className="w-5" src="/img/svg_react.svg" alt="React" />
                        <span className="hidden">React</span>
                    </div>
                    <div className="flex items-center">
                        <img className="w-5 invert-90" src="/img/svg_next.svg" alt="Next" />
                        <span className="hidden">Next.js</span>
                    </div>
                    <div className="flex items-center">
                        <img className="w-5 invert-90 -translate-y-[-2px]" src="/img/svg_rest.svg" alt="Rest" />
                        <span className="hidden">Rest.api</span>
                    </div>
                </div>

            </div>
        </footer>
    )
}
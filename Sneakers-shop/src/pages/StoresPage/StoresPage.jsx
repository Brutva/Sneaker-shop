import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import './StoresPage.css';
import '../../normalize/adaptive.css'

export function StoresPage() {
    return (
        <div>
            <Header />
            <main className="page">
                <div className="container">
                    <h1 className="page__title">All Stores</h1>
                    <p className="page__sub">12 verified partner stores</p>

                    <div className="products-grid" style={{marginTop:"18px"}}>
                        <a className="product-card underline" href="store.html" style={{padding:"16px"}}>
                            <div style={{display:"flex", gap:"12px", alignItems:"flex-start"}}>
                                <div
                                    style={{width:"64px",height:"64px",borderRadius:"16px",overflow:"hidden",background:"hsl(var(--secondary))"}}>
                                    <img src="src/public/images/SneakerStore.jpg" style={{width:"64px", height:"64px"}} alt=""/>
                                </div>
                                <div style={{flex:1, minWidth:0}}>
                                    <div style={{fontWeight:900, fontSize:"18px"}} className="underline">SneakerStore</div>
                                    <div className="rating underline">
                                        <span className="rating__stars underline" style={{"--rating":4.7}}></span>
                                        <span className="rating__value">4.7</span>
                                        <span className="rating__count">(12,340)</span>
                                    </div>
                                </div>
                            </div>

                            <p className="muted line-clamp-2" style={{marginTop:"10px"}}>
                                Fast delivery, easy returns, verified reviews. (policy placeholder)
                            </p>

                            <div
                                style={{marginTop:"12px", paddingTop:"12px", borderYop:"1px solid hsl(var(--border)/.6)", display:"flex", justifyContent: "space-between", alignItems:"center"}}>
                            <span className="muted underline" style={{fontWeight:800}}>📦 320 products</span>
                                <span style={{color:"hsl(var(--primary))", fontWeight:900}}>View store →</span>
                            </div>
                        </a>

                        <a className="product-card underline" href="store.html" style={{padding:"16px"}}>
                            <div style={{display:"flex", gap:"12px", alignItems:"flex-start"}}>
                                <div
                                    style={{width:"64px",height:"64px", borderRadius:"16px", overflow:"hidden",background:"hsl(var(--secondary))"}}>
                                    <img src="src/public/images/UrbanKicks.jpg" style={{ width: "64px", height: "64px" }} alt=""/>
                                </div>
                                <div style={{flex:1, minWidth:0}}>
                                    <div style={{fontWeight:900, fontSize:"18px"}}>UrbanKicks</div>
                                    <div className="rating">
                                        <span className="rating__stars" style={{"--rating":4.4}}></span>
                                        <span className="rating__value">4.4</span>
                                        <span className="rating__count">(5,120)</span>
                                    </div>
                                </div>
                            </div>

                            <p className="muted line-clamp-2" style={{marginYop:"10px"}}>
                                Worldwide shipping, premium packaging, tracked delivery. (policy placeholder)
                            </p>

                            <div
                                style={{marginTop:"12px", paddingTop:"12px", borderTop:"1px solid hsl(var(--border)/.6)", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                <span className="muted underline" style={{fontWeight:800}}>📦 140 products</span>
                                <span style={{color:"hsl(var(--primary))", fontWeight:900}}>View store →</span>
                            </div>
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
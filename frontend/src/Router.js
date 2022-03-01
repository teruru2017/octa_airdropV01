import React, { lazy } from "react"
import { Router, Route } from "react-router-dom"



const home = lazy(() => import('./views/Home'))
const airdrop = lazy(() => import("./views/Airdrop"))

const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            return (
                <ContextLayout.Consumer>
                    {context => {
                        let LayoutTag = context.fullLayout;

                        return (
                            <LayoutTag {...props} permission={props.user}>
                                <Suspense fallback={<Spinner />}>
                                    <Component {...props} />
                                </Suspense>
                            </LayoutTag>
                        )
                    }}
                </ContextLayout.Consumer>
            )
        }}
    />
)
const mapStateToProps = state => {
    return {

    }
}

const AppRoute = connect(mapStateToProps)(RouteConfig)

class AppRouter extends React.Component {
    render() {
        return (
            <Router history={history}>
                <AppRoute exact path="/" Component={home} />

                <AppRoute
                    path="/airdrop"
                    component={airdrop}
                />
            </Router>
        );
    };
}

export default AppRouter;
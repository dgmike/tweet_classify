import React from 'react';
import { Route } from 'react-router-dom';
import { Dashboard } from '../../pages/dashboard';
import { Terms } from '../../pages/terms';

const PageContent = () => (
  <>
    <Route path="/" exact component={Dashboard} />
    <Route path="/terms" component={Terms} />
  </>
);

export default PageContent;

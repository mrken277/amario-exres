import Box from 'modules/common/components/Box';
import EmptyState from 'modules/common/components/EmptyState';
import Icon from 'modules/common/components/Icon';
import ModalTrigger from 'modules/common/components/ModalTrigger';
import Tip from 'modules/common/components/Tip';
import { ButtonRelated } from 'modules/common/styles/main';
import { __, urlParser } from 'modules/common/utils';
import GetConformity from 'modules/conformity/containers/GetConformity';
import { SectionBody, SectionBodyItem } from 'modules/layout/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import CarChooser from '../../containers/CarChooser';
import { queries } from '../../graphql';
import { ICar } from '../../types';

type Props = {
  name: string;
  items?: ICar[];
  mainType?: string;
  mainTypeId?: string;
  onSelect?: (cars: ICar[]) => void;
  collapseCallback?: () => void;
};

function Component(
  this: any,
  {
    name,
    items = [],
    mainType = '',
    mainTypeId = '',
    onSelect,
    collapseCallback
  }: Props
) {
  const renderCarChooser = props => {
    return (
      <CarChooser
        {...props}
        data={{ name, cars: items, mainType, mainTypeId }}
        onSelect={onSelect}
      />
    );
  };

  const renderRelatedCarChooser = props => {
    return (
      <CarChooser
        {...props}
        data={{ name, cars: items, mainTypeId, mainType, isRelated: true }}
        onSelect={onSelect}
      />
    );
  };

  const carTrigger = (
    <button>
      <Icon icon="plus-circle" />
    </button>
  );

  const relCarTrigger = (
    <ButtonRelated>
      <span>{__('See related cars..')}</span>
    </ButtonRelated>
  );

  const quickButtons = (
    <ModalTrigger
      title="Associate"
      trigger={carTrigger}
      size="lg"
      content={renderCarChooser}
    />
  );

  const relQuickButtons = (
    <ModalTrigger
      title="Related Associate"
      trigger={relCarTrigger}
      size="lg"
      content={renderRelatedCarChooser}
    />
  );

  const content = (
    <SectionBody>
      {items.map((car, index) => (
        <SectionBodyItem key={index}>
          <Link to={`/cars/details/${car._id}`}>
            <Icon icon="arrow-to-right" />
          </Link>
          <span>{car.primaryName || 'Unknown'}</span>
          <Tip text={car.website || ''}>
            <a href={`//${car.website}`}>
              {urlParser.extractRootDomain(car.website || '')}
            </a>
          </Tip>
        </SectionBodyItem>
      ))}
      {items.length === 0 && <EmptyState icon="building" text="No car" />}
      {mainTypeId && mainType && relQuickButtons}
    </SectionBody>
  );

  return (
    <Box
      title={__('Cars')}
      name="showCars"
      extraButtons={quickButtons}
      isOpen={true}
      callback={collapseCallback}
    >
      {content}
    </Box>
  );
}

type IProps = {
  mainType?: string;
  mainTypeId?: string;
  isOpen?: boolean;
  cars?: ICar[];
  onSelect?: (datas: ICar[]) => void;
  collapseCallback?: () => void;
};

export default (props: IProps) => {
  return (
    <GetConformity
      {...props}
      relType="car"
      component={Component}
      queryName="cars"
      itemsQuery={queries.cars}
      alreadyItems={props.cars}
    />
  );
};
